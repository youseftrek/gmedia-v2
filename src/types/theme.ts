/* eslint-disable @typescript-eslint/no-explicit-any */
export type Theme = {
  id: string;
  name: string;
  img?: string;
  pages: Page[];
  locPath: string;
};

export type Page = {
  name: string;
  sections: string[];
  body: Section[];
  initialValues: any[];
};

export type Section = {
  id: string;
  type: string;
  name: string;
  data: Record<string, any>;
};
