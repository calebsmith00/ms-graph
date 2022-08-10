import type {
  NextApiRequest,
  NextApiResponse,
  NextPage,
  NextPageContext,
} from "next";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";

export type NextApiContext = {
  req: NextApiRequest | IncomingMessage | undefined;
  res: NextApiResponse | ServerResponse | undefined;
};

interface MiddlewareOptions {
  context: NextApiContext;
  options: any;
  shouldSetEmpty: boolean;
  error: string;
  supplyContext: Function;
  getCookie: Function;
  getCookies: Function;
  setCookie: Function;
  setIfEmpty: Function;
  catchError: Function;
  hasInvalidCookie: Function;
}

export default function cookieMiddleware() {
  const defaultOptions = { httpOnly: false };

  const middleware: MiddlewareOptions = {
    context: { req: undefined, res: undefined },
    error: "",
    shouldSetEmpty: false,
    options: defaultOptions,

    supplyContext: function (context: NextPageContext | NextApiContext) {
      this.context = {
        req: context?.req || undefined,
        res: context?.res || undefined,
      };
      this.catchError();

      this.options = {
        ...defaultOptions,
        req: this.context.req,
        res: this.context.res,
      };

      return this;
    },

    catchError: function () {
      if (!this.context || !this.context.req || !this.context.res)
        return (this.error = "Invalid context.");

      return false;
    },

    setCookie: function (name: string, data: any) {
      if (!this.options.req || !this.options.res) return;
      const cookieValue = {
        ...data,
        cookieName: name.toLowerCase(),
      };
      setCookie(name, cookieValue, this.options);

      const cookie = this.getCookie(name);
      if (cookie) console.log(`Your cookie, ${name}, was set!`);
      return cookie;
    },

    getCookie: function (name: string) {
      if (!this.options.req || !this.options.res) return;
      name = name.toLowerCase();
      const cookieExists = hasCookie(name, this.options);

      if (!cookieExists && this.shouldSetEmpty) {
        this.setCookie(name, "");
      }

      if (!cookieExists && !this.shouldSetEmpty) {
        return false;
      }

      const cookie = getCookie(name, this.options);
      try {
        if (typeof cookie === "string") return JSON.parse(cookie);
      } catch (e) {
        console.log(`Couldn't parse JSON value of getCookie(${name})`);
        return cookie;
      }
    },

    getCookies: function (names: string[]) {
      const cookies: any[] = [];
      for (let name in names) {
        const cookieName = names[name];
        const cookie = this.getCookie(cookieName);
        if (cookie !== undefined) cookies.push(cookie);
      }

      const foundInvalid = this.hasInvalidCookie(cookies);
      if (foundInvalid) {
        console.log(
          "Cookie does not exist, returning an instance of this object"
        );
        return this;
      }

      return cookies;
    },

    hasInvalidCookie: function (cookies: any[]) {
      if (cookies.length === 0) return true;
      const badCookie = cookies.find((cookie) => {
        if (cookie === undefined || cookie === false) return true;
      });

      if (badCookie !== undefined) return true;
      return false;
    },

    setIfEmpty: function () {
      this.shouldSetEmpty = true;
      return this;
    },
  };

  return middleware;
}
