/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/common.ts

export class Common {
  /**
   * Format a string with replacement patterns
   */
  static format(template: string, ...args: any[]): string {
    return template.replace(/{(\d+)}/g, (match, index) => {
      return typeof args[index] !== "undefined" ? args[index] : match;
    });
  }

  /**
   * Calculate element position
   */
  static getPosition(element: HTMLElement): { x: number; y: number } {
    let xPosition = 0;
    let yPosition = 0;

    while (element) {
      xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPosition += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent as HTMLElement;
    }

    return { x: xPosition, y: yPosition };
  }

  /**
   * Convert a data URI to a Blob object
   */
  static dataURItoBlob(dataURI: string): Blob {
    // Convert base64 to raw binary data
    const byteString = atob(dataURI.split(",")[1]);

    // Get the MIME type
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // Write the bytes to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Create and return a Blob
    return new Blob([ab], { type: mimeString });
  }

  /**
   * Convert an object to FormData
   */
  static objectToFormData(
    formData: FormData,
    params: any,
    name: string = ""
  ): void {
    if (
      typeof params === "object" &&
      !(params instanceof File) &&
      !(params instanceof Blob) &&
      params !== null
    ) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (name === "") {
          Common.objectToFormData(formData, value, key);
        } else {
          Common.objectToFormData(formData, value, `${name}[${key}]`);
        }
      });
    } else {
      if (params instanceof Blob && "name" in params) {
        formData.append(name, params, params.name as string);
      } else {
        formData.append(name, params === null ? "" : params);
      }
    }
  }

  /**
   * Show a loading mask over an element
   */
  static mask(element: HTMLElement, id: string): void {
    const maskHTML =
      '<div class="loading-mask-image flex items-center justify-center"><div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>';

    const div = document.createElement("div");
    div.setAttribute(
      "class",
      "loading-mask-container fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
    );
    div.setAttribute("id", id);
    div.innerHTML = maskHTML;

    element.appendChild(div);
  }

  /**
   * Remove a loading mask
   */
  static unmask(id: string): void {
    const div = document.getElementById(id);
    if (div !== null) {
      div.parentNode?.removeChild(div);
    }
  }

  /**
   * Show a confirmation dialog
   */
  static showConfirmMsg(
    msg: string,
    callback: () => void,
    cancelCallback?: () => void,
    additionalMsg?: string,
    closeOnConfirm: boolean = true
  ): void {
    if (typeof window !== "undefined") {
      if (confirm(additionalMsg ? `${msg}\n${additionalMsg}` : msg)) {
        callback();
      } else if (cancelCallback) {
        cancelCallback();
      }
    }
  }

  /**
   * Show an alert message
   */
  static alertMsg(msg: string, callback?: () => void): void {
    if (typeof window !== "undefined") {
      alert(msg);
      if (callback) {
        callback();
      }
    }
  }
}
