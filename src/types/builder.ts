import { Theme } from "./theme";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type Builder = {
  draftId: string | null;
  isPublished: boolean;
  theme: Theme | null;
  page: string | null;
  body: {
    id: string;
    sectionType: string;
    data: Record<string, string>;
  }[];
  device: DeviceTypes;
  previewMode: boolean;
};

export type BuilderState = {
  builder: Builder;
  history: HistoryState;
};

export type HistoryState = {
  history: Builder[];
  currentIndex: number;
};

export type BuilderAction =
  | { type: "SET_THEME"; payload: { theme: Theme } }
  | { type: "SET_PAGE"; payload: { page: string } }
  | {
      type: "ADD_SECTION";
      payload: { page: string; sectionName: string };
    }
  | {
      type: "UPDATE_SECTION";
      payload: {
        page: string;
        sectionId: number;
        data: Record<string, string>;
      };
    }
  | {
      type: "DELETE_SECTION";
      payload: { page: string | null; sectionId: string };
    }
  | { type: "CHANGE_DEVICE"; payload: { device: DeviceTypes } }
  | { type: "TOGGLE_PREVIEW_MODE" }
  | { type: "REDO" }
  | { type: "UNDO" }
  | { type: "SAVE_DRAFT" }
  | { type: "PUBLISH" }
  | {
      type: "REORDER_SECTIONS";
      payload: {
        page: string | null;
        newOrder: Builder["body"];
      };
    };
