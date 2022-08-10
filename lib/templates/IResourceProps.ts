interface ResourceObj {
  displayName?: string;
  id: string;
  link?: string;
  self?: string;
  contentUrl?: string;
}

export interface ResourceProps {
  collection: ResourceObj[];
  selected?: ResourceObj;
}
