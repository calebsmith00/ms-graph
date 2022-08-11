import { ResponseType } from "@microsoft/microsoft-graph-client";
import { client } from "../client";
import { NextApiContext } from "../cookies";
import parse from "../html";
import type { ResourceProps } from "./IResourceProps";

class Templates {
  notebook: ResourceProps;
  section: ResourceProps;
  page: ResourceProps;
  content: any;
  cookies: any[];
  userId: string;
  selectors: string[];

  private constructor() {
    this.notebook = { collection: [] };
    this.section = { collection: [] };
    this.page = { collection: [] };
    this.content = { parsed: {} };
    this.userId = "";
    this.cookies = [];
    this.selectors = ["displayName", "id", "links", "self"];
    //this.getCookies();
  }

  private async getCookies() {
    const fetchOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "password",
      }),
    };

    const cookiesReq = await fetch(
      "http://localhost:3000/api/retrieve-cookies",
      fetchOptions
    );

    const cookiesRes = await cookiesReq.json();
    const cookies = cookiesRes.length === 0 ? [] : cookiesRes;

    return (this.cookies = cookies);
  }

  static init() {
    return new Templates();
  }

  setUserId(userId: string) {
    this.userId = userId;

    return this;
  }

  setSelectors(selectors: string[], shouldAppend?: boolean) {
    const newSelectors: string[] = shouldAppend
      ? [...this.selectors, ...selectors]
      : selectors;

    if (selectors.length !== 0) {
      this.selectors = newSelectors;
    }

    return this;
  }

  setNotebookId(notebookId: string) {
    this.notebook = {
      ...this.notebook,
      selected: {
        id: notebookId,
      },
    };

    return this;
  }

  setSectionId(sectionId: string) {
    this.section = {
      ...this.section,
      selected: {
        id: sectionId,
      },
    };

    return this;
  }

  setPageId(pageId: string) {
    this.page = {
      ...this.page,
      selected: {
        id: pageId,
      },
    };

    return this;
  }

  getKeyBySelector(selector: string) {
    return this.selectors.indexOf(selector);
  }

  removeSelector(selector: string) {
    const indexToRemove = this.getKeyBySelector(selector);
    if (indexToRemove !== -1) {
      this.selectors.splice(indexToRemove, 1);
    }

    return this;
  }

  async getNotebooks() {
    const notebookReq = await client
      .api(`users/${this.userId}/onenote/notebooks`)
      .select(this.selectors)
      .get();

    if (notebookReq && notebookReq.value.length !== 0) {
      this.notebook = {
        selected: notebookReq.value[0],
        collection: notebookReq.value,
      };
    }

    return this;
  }

  async getSections() {
    const endpointIfSelected: string | undefined = this.notebook.selected
      ? `users/${this.userId}/onenote/notebooks/${this.notebook.selected.id}/sections`
      : undefined;

    const sectionsReq = await client
      .api(
        endpointIfSelected === undefined
          ? `users/${this.userId}/onenote/sections`
          : endpointIfSelected
      )
      .select(this.selectors)
      .get();

    if (sectionsReq && sectionsReq.value.length !== 0) {
      this.section = {
        selected: sectionsReq.value[0],
        collection: sectionsReq.value,
      };
    }

    return this;
  }

  async getPages() {
    const endpointIfSelected: string | undefined = this.section.selected
      ? `users/${this.userId}/onenote/sections/${this.section.selected.id}/pages`
      : undefined;

    if (endpointIfSelected === undefined) return;

    const pagesReq = await client.api(endpointIfSelected).get();

    this.page = {
      selected: pagesReq.value[0],
      collection: pagesReq.value,
    };
  }

  async getPageContent() {
    const endpoint: string | undefined = this.page.selected
      ? this.page.selected.contentUrl
      : undefined;

    if (endpoint === undefined) return;
    const contentReq = await client
      .api(endpoint + "?includeIDs=true")
      .responseType(ResponseType.TEXT)
      .get();

    if (typeof contentReq !== "string") return;

    const parseAttempt = parse(contentReq)?.setTableId("").constructFullTable();
    const parsed =
      typeof window === "undefined" || parseAttempt === undefined
        ? undefined
        : parseAttempt;

    this.content = {
      contentUrl: endpoint,
      parsed,
      raw: contentReq.toString(),
    };
  }

  async getTemplates() {
    await this.getNotebooks();
    await this.getSections();
    this.removeSelector("displayName");
    this.setSelectors(["title"], true);
    await this.getPages();
    await this.getPageContent();

    return {
      notebook: this.notebook,
      section: this.section,
      page: this.page,
      content: this.content,
    };
  }
}

export { Templates };
