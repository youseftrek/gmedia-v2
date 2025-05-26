import Common from "./Common.js";
import { Formio } from "formiojs";
import bootstrap from "@formio/bootstrap3";
// Check if we're running on the client side
const isClient = typeof window !== "undefined";

var gUniqueKeys = [];

var map = new Map();

const formBuilder = {
  builder: { data: null },
  IsFormReadonly: true,
  CurrentLanguage: "en",
  Form: {},
  FormDesigner: {},
  FormDesignerTranslation: {},
  FormMode: "",
  CombonentKeysToBeDisabled: [],
  Exclude: [],
  BuildForm: function (_formId, _model) {
    // Only run this on the client side
    if (!isClient) return;

    var translationAr = formBuilder.GetFormTranslation(
      "Ar",
      formBuilder.FormDesignerTranslation
    );
    var translationEn = formBuilder.GetFormTranslation(
      "En",
      formBuilder.FormDesignerTranslation
    );
    if (formBuilder.CombonentKeysToBeDisabled.length > 0)
      formBuilder.DisableControls();

    Formio.use(bootstrap);

    Formio.createForm(
      document.getElementById(_formId),
      formBuilder.FormDesigner,
      {
        noAlerts: true,
        template: "bootstrap3",
        readOnly: formBuilder.IsFormReadonly,
        language: formBuilder.CurrentLanguage,
        i18n: {
          en: translationEn,
          ar: translationAr,
        },
      }
    ).then(function (form) {
      if (formBuilder.FormMode != "Inquiry")
        // set builder with Edit or Add
        formBuilder.builder = form;

      form.nosubmit = true;
      if (_model.formData !== null) {
        form.submission = { data: _model.formData };
      }
      if (formBuilder.FormDesigner.components.length === 0) {
        document.getElementById(_formId).classList.add("d-none");
      }
      if (formBuilder.IsFormReadonly === false) {
        form.on("change", function (value) {
          const applyRequestButton = document.querySelector(".apply-request");
          applyRequestButton.disabled = !value.isValid;

          if (form.checkValidity()) {
            applyRequestButton.disabled = false;
          } else {
            applyRequestButton.disabled = true;
          }
        });
        form.on("submit", function (submission) {
          delete submission.data.submit;
          gUniqueKeys = [];

          saveOptions.params.FormData = JSON.stringify(submission.data);
          saveOptions.params.id = document.getElementById("id").value;
          form.emit("submitDone", submission);
        });
      }
      // Check form validity and enable/disable the button
      if (form.checkValidity()) {
        document.querySelectorAll(".apply-request").forEach((el) => {
          el.disabled = false;
        });
      } else {
        document.querySelectorAll(".apply-request").forEach((el) => {
          el.disabled = true;
        });
      }

      // Hide the submit form button if it exists
      const submitButton = document.querySelector(".btn-wizard-nav-submit");
      if (submitButton) {
        submitButton.style.display = "none";
      }

      formBuilder.Form = form;
    });
  },

  clearAttachmentsFromData: function (data, saveOptions) {
    Object.keys(data).forEach(function (key) {
      if (key in saveOptions.params) {
        delete saveOptions.params[key];
      }
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          for (let i = 0; i < data[key].length; i++) {
            let item = data[key][i];
            if (item !== null) {
              var isObjectContainsAttachments = false;
              Object.keys(item).forEach(function (key) {
                if (Array.isArray(item[key])) {
                  isObjectContainsAttachments = true;
                }
              });
              if (isObjectContainsAttachments) {
                formBuilder.clearAttachmentsFromData(item, saveOptions);
                continue;
              }
            }
          }
        }
      } else if (typeof data[key] === "object") {
        formBuilder.clearAttachmentsFromData(data[key], saveOptions);
      }
    });
  },

  fetchAttachmentsFromData: function (data, saveOptions) {
    let attachmentProperties = [
      "hash",
      "name",
      "originalName",
      "size",
      "type",
      "url",
    ];
    Object.keys(data).forEach(function (key) {
      let attachmentArray = new Array();
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          for (let i = 0; i < data[key].length; i++) {
            let isAttachment = true;
            let propertyCount = 0;
            let item = data[key][i];
            if (item !== null) {
              var isObjectContainsAttachments = false;
              Object.keys(item).forEach(function (key) {
                if (key && key == "storage") {
                  delete item[key];
                }
                if (Array.isArray(item[key])) {
                  isObjectContainsAttachments = true;
                }
              });
              if (isObjectContainsAttachments) {
                formBuilder.fetchAttachmentsFromData(item, saveOptions);
                continue;
              }
              var hashKey = formBuilder.generateUniqueKey();
              Object.keys(item).forEach(function (key) {
                if (key === "id") {
                  //update mode
                  //propertyCount++;
                } else {
                  propertyCount++;
                  if (attachmentProperties.indexOf(key) === -1) {
                    isAttachment = false;
                  }
                }
              });
              if (
                isAttachment &&
                propertyCount === attachmentProperties.length
              ) {
                if (item["id"] !== undefined) {
                  if (window.navigator.msSaveBlob) {
                    //IE
                    let blob = new Blob([]);
                    blob.name = item["id"];
                    attachmentArray.push(blob);
                    item["url"] = "";
                    delete item["storage"];
                  }
                  //else if (item["size"] > 0) {
                  //    let file = new Blob([]);
                  //    file.size = item["size"];
                  //    attachmentArray.push(new File(file, item["originalName"] + "/" + item["id"], { type: item["type"] }));
                  //}
                  else {
                    attachmentArray.push(new File([], item["id"]));
                    item["url"] = "";
                    delete item["storage"];
                  }
                } else {
                  if (window.navigator.msSaveBlob) {
                    //IE
                    if (item.size !== 0) {
                      item["id"] = hashKey;
                      let blob = new Blob([Common.dataURItoBlob(item["url"])], {
                        type: item["type"],
                      });
                      blob.name = item["originalName"] + "/" + hashKey;
                      attachmentArray.push(blob);
                      item["url"] = "";
                      delete item["storage"];
                    }
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
                  }
                }
              }
            }
          }
          if (attachmentArray.length > 0) {
            if (
              saveOptions.params[key] !== undefined &&
              saveOptions.params[key].length > 0
            ) {
              for (var i = 0; i < attachmentArray.length; i++) {
                saveOptions.params[key].push(attachmentArray[i]);
              }
            } else {
              saveOptions.params[key] = attachmentArray;
            }
          }
        }
      } else if (typeof data[key] === "object") {
        formBuilder.fetchAttachmentsFromData(data[key], saveOptions);
      }
    });
  },

  clearAttachments: function (data, saveOptions) {
    Object.keys(data).forEach(function (key) {
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          var currentFiles = [];
          for (let i = 0; i < data[key].length; i++) {
            let item = data[key][i];
            if (item !== null) {
              if (saveOptions.params[key] !== undefined) {
                var currentFile = saveOptions.params[key].filter(
                  (c) => c.name == item.originalName + "/" + item.id
                );
                if (currentFile.length > 0) currentFiles.push(currentFile[0]);
              }
              var isObjectContainsAttachments = false;
              Object.keys(item).forEach(function (key) {
                if (key && key == "storage") {
                  delete item[key];
                }
                if (Array.isArray(item[key])) {
                  isObjectContainsAttachments = true;
                }
              });
              if (isObjectContainsAttachments) {
                formBuilder.clearAttachmentsFromData(item, saveOptions);
                continue;
              }
            }
          }
          saveOptions.params[key] = currentFiles;
        }
      } else if (typeof data[key] === "object") {
        formBuilder.clearAttachmentsFromData(data[key], saveOptions);
      }
    });
  },

  fetchAttachments: function (data, saveOptions) {
    let attachmentProperties = ["name", "originalName", "size", "type", "url"];
    Object.keys(data).forEach(function (key) {
      let attachmentArray = new Array();
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          for (let i = 0; i < data[key].length; i++) {
            let isAttachment = true;
            let propertyCount = 0;
            let item = data[key][i];
            if (item !== null) {
              var isObjectContainsAttachments = false;
              Object.keys(item).forEach(function (key) {
                if (key && key == "storage") {
                  delete item[key];
                }
                if (Array.isArray(item[key])) {
                  isObjectContainsAttachments = true;
                }
              });
              if (isObjectContainsAttachments) {
                formBuilder.fetchAttachmentsFromData(item, saveOptions);
                continue;
              }
              var hashKey = formBuilder.generateUniqueKey();
              Object.keys(item).forEach(function (key) {
                if (key === "id") {
                  //update mode
                  //propertyCount++;
                } else {
                  propertyCount++;
                  if (attachmentProperties.indexOf(key) === -1) {
                    isAttachment = false;
                  }
                }
              });
              if (
                isAttachment &&
                propertyCount === attachmentProperties.length
              ) {
                if (item["id"] !== undefined) {
                  continue;
                } else {
                  if (window.navigator.msSaveBlob) {
                    //IE
                    if (item.size !== 0) {
                      item["id"] = hashKey;
                      let blob = new Blob([Common.dataURItoBlob(item["url"])], {
                        type: item["type"],
                      });
                      blob.name = item["originalName"] + "/" + hashKey;
                      attachmentArray.push(blob);
                      item["url"] = "";
                      delete item["storage"];
                    }
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
                  }
                }
              }
            }
          }
          if (attachmentArray.length > 0) {
            if (
              saveOptions.params[key] !== undefined &&
              saveOptions.params[key].length > 0
            ) {
              for (var i = 0; i < attachmentArray.length; i++) {
                saveOptions.params[key].push(attachmentArray[i]);
              }
            } else {
              saveOptions.params[key] = attachmentArray;
            }
          }
        }
      } else if (typeof data[key] === "object") {
        formBuilder.fetchAttachmentsFromData(data[key], saveOptions);
      }
    });
  },

  fetchProfileAttachments: function (data, saveOptions) {
    Object.keys(data).forEach(function (key) {
      if (Array.isArray(data[key])) {
        if (data[key].length > 0) {
          var currentFiles = [];
          for (let i = 0; i < data[key].length; i++) {
            let item = data[key][i];
            var hashKey = formBuilder.generateUniqueKey();
            // if storage is exists
            if (item["id"] !== undefined) {
              if (window.navigator.msSaveBlob) {
                //IE
                if (item.size !== 0) {
                  let blob = new Blob([item.size], { type: item["type"] });
                  blob.name = item["originalName"] + "/" + hashKey;
                  blob.size = item.size;
                  currentFiles.push(blob);
                }
              } else {
                if (item.size !== 0) {
                  let fileName = item["originalName"] + "/" + hashKey;
                  let file = new File([], fileName, { type: item["type"] });
                  file.size = item.size;
                  currentFiles.push(file);
                }
              }
            } else if (item["id"] == undefined) {
              if (window.navigator.msSaveBlob) {
                //IE
                if (item.size !== 0) {
                  item["id"] = hashKey;
                  let blob = new Blob([Common.dataURItoBlob(item["url"])], {
                    type: item["type"],
                  });
                  blob.name = item["originalName"] + "/" + hashKey;
                  currentFiles.push(blob);
                  item["url"] = "";
                  delete item["storage"];
                }
              } else {
                if (item.size !== 0) {
                  item["id"] = hashKey;

                  let fileName = item["originalName"] + "/" + hashKey;
                  let file = new File(
                    [Common.dataURItoBlob(item["url"])],
                    fileName,
                    { type: item["type"] }
                  );
                  currentFiles.push(file);

                  item["url"] = "";
                  delete item["storage"];
                }
              }
            }
          }
          saveOptions.params[key] = currentFiles;
        }
      }
    });
  },

  generateUniqueKey: function () {
    var key = "#" + Math.random().toString(36).substr(2, 9) + "#";
    while (gUniqueKeys.includes(key)) {
      key = "#" + Math.random().toString(36).substr(2, 9) + "#";
    }
    gUniqueKeys.push(key);
    return key;
  },

  GetFormTranslation: function (_lang, _formTranslation) {
    var translatedForm = {};
    for (var i = 0; i < _formTranslation.length; i++) {
      translatedForm[_formTranslation[i].Keyword] = eval(
        "_formTranslation[i]." + _lang
      );
    }
    return translatedForm;
  },

  BuildActions: function (_formActions, id, documentTypeId, documentId) {
    if (typeof builder === "undefined") builder = {};

    var action = "",
      _transitionLabel = "",
      onClickAction = `request.SendTask(builder, ${id},"/Task/Send", this)`,
      buttonId = "",
      cssClass = "";

    for (var i = 0; i < _formActions.length; i++) {
      var _transitionLabel = _formActions[i].name;
      cssClass = "";
      // Online Payment
      if (
        _transitionLabel.toLowerCase() ==
        resources.buttons.onlinePayment.toLowerCase()
      ) {
        onClickAction = `payment.GoToPay(${id}, ${documentId})`;
        buttonId = "btn_onlinePayment";
        cssClass = "apply-request";
      } else if (
        _transitionLabel.toLowerCase() ==
        resources.buttons.offlinePayment.toLowerCase()
      ) {
        onClickAction = `request.SendTask(builder, ${id},"/Task/Send", this)`;
        buttonId = "btn_offlinePayment";
        cssClass = "apply-request";
      } else if (
        _transitionLabel.toLowerCase() ==
          "Close Permit (Logistic Representative)".toLowerCase() ||
        _transitionLabel.toLowerCase() ==
          "Close Permit (Managing Agent Representative)".toLowerCase()
      ) {
        onClickAction = `request.ValidateClosePermitFormBeforeClosePermit(builder, ${id},"/Task/Send", this)`;
        buttonId = "btn_closePermit";
      } else if (
        _transitionLabel.toLowerCase() == "Request for extension".toLowerCase()
      ) {
        onClickAction = `request.ValidateRequestForExtensionForm(builder, ${id},"/Task/Send", this)`;
        buttonId = "btn_requestForExtension";
      } else
        onClickAction = `request.SendTask(builder, ${id},"/Task/Send", this)`;

      // Send Inquiry
      if (
        _transitionLabel.toLowerCase() ==
        resources.buttons.sendInquiry.toLowerCase()
      ) {
        buttonId = "btn_sendInquiry";
        cssClass = "apply-request";
      }

      action = `<button type='submit' class='btn btn-success ${cssClass}' id='${buttonId}'
                              onclick='${onClickAction}' data-transitionLabel="${_transitionLabel}">${_transitionLabel}
                     </button>&nbsp;`;
      $("#formFooter .actions-wrapper").append(action);
    }
  },

  DisableControls: function () {
    formBuilder.CombonentKeysToBeDisabled.forEach((key) => {
      var formComponentsCount = formBuilder.FormDesigner.components.length;
      if (key === "*") {
        // disable all controls
        for (var i = 0; i < formComponentsCount; i++) {
          var page = formBuilder.FormDesigner.components[i];
          for (var j = 0; j < page.components.length; j++) {
            if (formBuilder.Exclude.indexOf(page.components[j].key) < 0)
              page.components[j].disabled = true;
          }
        }
      } else {
        for (var i = 0; i < formComponentsCount; i++) {
          var comp = formBuilder.FormDesigner.components[i].components.filter(
            (com) => com.key == key
          );
          if (comp.length > 0) comp[0].disabled = true;
        }
      }
    });
  },
};
export default formBuilder;
