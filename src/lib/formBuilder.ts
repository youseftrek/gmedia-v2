/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/formBuilder.ts
import { Common } from "./common";
// Remove static import: import { Formio } from "formiojs";

// Unique keys for attachment handling
let gUniqueKeys: string[] = [];

export class FormBuilder {
  public builder: any = { data: null };
  public IsFormReadonly: boolean = true;
  public CurrentLanguage: string = "ar";
  public Form: any = {};
  public FormDesigner: any = {};
  public FormDesignerTranslation: any = {};
  public FormMode: number = 0;
  public CombonentKeysToBeDisabled: string[] = [];
  public Exclude: string[] = [];
  private formioInstance: any = null;

  constructor() {
    // Initialize properties
    this.builder = { data: null };
    this.IsFormReadonly = true;
    this.CurrentLanguage = "ar";
    this.Form = {};
    this.FormDesigner = {};
    this.FormDesignerTranslation = {};
    this.FormMode = 0;
    this.CombonentKeysToBeDisabled = [];
    this.Exclude = [];
  }

  // New method to dynamically load Formio
  async loadFormio(): Promise<any> {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.formioInstance) {
      try {
        const formioModule = await import("formiojs");
        this.formioInstance = formioModule.Formio;

        // You can also set up any global Formio configuration here if needed
        // For example: this.formioInstance.fetch = (url, options) => {...}

        return this.formioInstance;
      } catch (error) {
        console.error("Error loading formiojs:", error);
        return null;
      }
    }

    return this.formioInstance;
  }

  async BuildForm(
    formId: string,
    model: any,
    setFormioInstance?: (instance: any) => void
  ): Promise<void> {
    if (typeof window === "undefined") return;

    // Dynamically load Formio first
    const Formio = await this.loadFormio();
    if (!Formio) {
      console.error("Failed to load Formio");
      return;
    }

    // Get form translations
    const translationAr = this.GetFormTranslation(
      "Ar",
      this.FormDesignerTranslation
    );
    const translationEn = this.GetFormTranslation(
      "En",
      this.FormDesignerTranslation
    );

    // Disable controls if needed
    if (this.CombonentKeysToBeDisabled.length > 0) {
      this.DisableControls();
    }

    // Create the form using Formio
    try {
      const form = await Formio.createForm(
        document.getElementById(formId),
        this.FormDesigner,
        {
          noAlerts: true,
          template: "bootstrap3",
          readOnly: this.IsFormReadonly,
          language: this.CurrentLanguage,
          i18n: {
            en: translationEn,
            ar: translationAr,
          },
        }
      );

      // Store the builder reference
      if (this.FormMode !== 7) {
        // Not Inquiry mode
        this.builder = form;
      }

      // Prevent default form submission
      form.nosubmit = true;

      // Set form data if provided
      if (model.formData !== null && model.formData !== "null") {
        form.submission = { data: model.formData };
      }

      // Hide empty forms
      if (
        this.FormDesigner.components &&
        this.FormDesigner.components.length === 0
      ) {
        const formElement = document.getElementById(formId);
        if (formElement) {
          formElement.classList.add("hidden");
        }
      }

      // Add event handlers for form editing
      if (this.IsFormReadonly === false) {
        form.on("change", (value: any) => {
          const applyRequestButton = document.querySelector(
            ".apply-request"
          ) as HTMLButtonElement;
          if (applyRequestButton) {
            applyRequestButton.disabled = value.isValid === false;

            if (form.checkValidity()) {
              applyRequestButton.disabled = false;
            } else {
              applyRequestButton.disabled = true;
            }
          }
        });

        form.on("submit", (submission: any) => {
          delete submission.data.submit;
          gUniqueKeys = [];
          form.emit("submitDone", submission);
        });
      }

      // Check form validity and update button state
      if (form.checkValidity()) {
        document.querySelectorAll(".apply-request").forEach((el) => {
          (el as HTMLButtonElement).disabled = false;
        });
      } else {
        document.querySelectorAll(".apply-request").forEach((el) => {
          (el as HTMLButtonElement).disabled = true;
        });
      }

      // Hide the submit form button if it exists
      const submitButton = document.querySelector(".btn-wizard-nav-submit");
      if (submitButton) {
        (submitButton as HTMLElement).style.display = "none";
      }

      // Store form reference
      this.Form = form;

      // Pass the form instance to parent component if needed
      if (setFormioInstance) {
        setFormioInstance(form);
      }
    } catch (error) {
      console.error("Error creating form:", error);
    }
  }

  GetFormTranslation(
    lang: string,
    formTranslation: any[]
  ): Record<string, string> {
    const translatedForm: Record<string, string> = {};

    if (formTranslation && Array.isArray(formTranslation)) {
      for (let i = 0; i < formTranslation.length; i++) {
        translatedForm[formTranslation[i].Keyword] = formTranslation[i][lang];
      }
    }

    return translatedForm;
  }

  DisableControls(): void {
    if (!this.FormDesigner || !this.FormDesigner.components) return;

    this.CombonentKeysToBeDisabled.forEach((key) => {
      const formComponentsCount = this.FormDesigner.components.length;

      if (key === "*") {
        // Disable all controls
        for (let i = 0; i < formComponentsCount; i++) {
          const page = this.FormDesigner.components[i];
          if (page && page.components) {
            for (let j = 0; j < page.components.length; j++) {
              if (this.Exclude.indexOf(page.components[j].key) < 0) {
                page.components[j].disabled = true;
              }
            }
          }
        }
      } else {
        for (let i = 0; i < formComponentsCount; i++) {
          if (
            this.FormDesigner.components[i] &&
            this.FormDesigner.components[i].components
          ) {
            const comp = this.FormDesigner.components[i].components.filter(
              (com: any) => com.key === key
            );
            if (comp.length > 0) {
              comp[0].disabled = true;
            }
          }
        }
      }
    });
  }

  clearAttachmentsFromData(data: any, saveOptions: any): void {
    if (!data) return;

    Object.keys(data).forEach((key) => {
      if (saveOptions && saveOptions.params && key in saveOptions.params) {
        delete saveOptions.params[key];
      }
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          for (let i = 0; i < data[key].length; i++) {
            let item = data[key][i];
            if (item !== null) {
              let isObjectContainsAttachments = false;
              Object.keys(item).forEach(function (key) {
                if (key && key === "storage") {
                  delete item[key];
                }
                if (Array.isArray(item[key])) {
                  isObjectContainsAttachments = true;
                }
              });
              if (isObjectContainsAttachments) {
                this.clearAttachmentsFromData(item, saveOptions);
                continue;
              }
            }
          }
        }
      } else if (typeof data[key] === "object" && data[key] !== null) {
        this.clearAttachmentsFromData(data[key], saveOptions);
      }
    });
  }

  fetchAttachmentsFromData(data: any, saveOptions: any): void {
    if (!data || !saveOptions) return;

    const attachmentProperties = [
      "hash",
      "name",
      "originalName",
      "size",
      "type",
      "url",
    ];

    Object.keys(data).forEach((key) => {
      let attachmentArray: any[] = [];

      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          for (let i = 0; i < data[key].length; i++) {
            let isAttachment = true;
            let propertyCount = 0;
            let item = data[key][i];

            if (item !== null) {
              let isObjectContainsAttachments = false;

              Object.keys(item).forEach((itemKey) => {
                if (itemKey && itemKey === "storage") {
                  delete item[itemKey];
                }
                if (Array.isArray(item[itemKey])) {
                  isObjectContainsAttachments = true;
                }
              });

              if (isObjectContainsAttachments) {
                this.fetchAttachmentsFromData(item, saveOptions);
                continue;
              }

              const hashKey = this.generateUniqueKey();

              Object.keys(item).forEach((itemKey) => {
                if (itemKey === "id") {
                  // Update mode, no action needed for property count
                } else {
                  propertyCount++;
                }
              });

              if (
                isAttachment &&
                propertyCount === attachmentProperties.length
              ) {
                if (item["id"] !== undefined) {
                  attachmentArray.push(new File([], item["id"]));
                  item["url"] = "";
                  delete item["storage"];
                } else {
                  if (item.size !== 0) {
                    item["id"] = hashKey;
                    attachmentArray.push(
                      new File(
                        [Common.dataURItoBlob(item["url"])],
                        item["originalName"] + "/" + hashKey,
                        { type: item["type"] }
                      )
                    );
                    item["url"] = "";
                    delete item["storage"];
                  }

                  if (saveOptions.params && saveOptions.params[key]) {
                    saveOptions.params[key].push(attachmentArray[i]);
                  }
                }
              } else if (saveOptions.params) {
                saveOptions.params[key] = attachmentArray;
              }
            }
          }
        } else if (typeof data[key] === "object" && data[key] !== null) {
          this.fetchAttachmentsFromData(data[key], saveOptions);
        }
      }
    });
  }

  generateUniqueKey(): string {
    if (typeof window === "undefined") return "";

    let key = "#" + Math.random().toString(36).substr(2, 9) + "#";
    while (gUniqueKeys.includes(key)) {
      key = "#" + Math.random().toString(36).substr(2, 9) + "#";
    }
    gUniqueKeys.push(key);
    return key;
  }
}
