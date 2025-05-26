var Common = (function (E) {
  E = {};

  // Check if window is defined (client-side) before accessing it
  const isClient = typeof window !== "undefined";

  if (isClient && window.navigator.msSaveBlob) {
    if (typeof $ !== "undefined") {
      $.ajaxSetup({ cache: false });
    }
  }

  E.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
      var reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
  };
  E.getPosition = function (element) {
    var xPosition = 0;
    var yPosition = 0;
    while (element) {
      xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPosition += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
  };
  E.mask = function () {
    var maskHTML =
      '<div class="loading-mask-image" style="display: block;"><i class="fa fa-spinner fa-pulse fa-2x fa - fw" /></div>';
    var div = document.createElement("div");
    div.setAttribute("class", "loading-mask-container");
    div.setAttribute("id", arguments[1]);
    div.innerHTML = maskHTML;
    var el = arguments[0];
    el.appendChild(div);
    var elPos = E.getPosition(el);
    var mask = document.getElementById(arguments[1]);
    mask.style.top = "0px";
    mask.style.height = $(document).height() + "px";
    mask.style.width = "100%";
  };
  E.unmask = function () {
    var div = document.getElementById(arguments[0]);
    if (div !== null) {
      div.parentNode.removeChild(div);
    }
  };
  E.showConfirmMsg = function (
    msg,
    callback,
    cancelCallback,
    additionalMsg,
    closeOnConfirm
  ) {
    if (typeof additionalMsg !== "undefined") {
      msg += "<br/>" + additionalMsg;
    }
    swal(
      {
        title: "",
        text: msg,
        showCancelButton: true,
        confirmButtonClass: "btn-info btn",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm:
          typeof closeOnConfirm !== "undefined" ? closeOnConfirm : true,
        closeOnCancel: true,
        html: typeof additionalMsg !== "undefined" ? true : false,
      },
      function (isConfirm) {
        if (isConfirm) {
          callback();
        } else {
          if (typeof cancelCallback === "function") {
            cancelCallback();
          }
        }
      }
    );
  };
  E.alertMsg = function (msg, callback) {
    swal(
      {
        title: "",
        text: msg,
        showCancelButton: false,
        confirmButtonClass: "btn-info btn",
        confirmButtonText: "Ok",
        closeOnConfirm: true,
        closeOnCancel: true,
        html: typeof additionalMsg !== "undefined" ? additionalMsg : "",
      },
      function () {
        if (typeof callback === "function") {
          callback();
        }
      }
    );
  };
  E.ajaxPost = function (
    url,
    params,
    successHandler,
    errorHandler,
    showMask,
    id //id of the mask location
  ) {
    if (showMask) {
      if (id !== undefined && id !== null) {
        var element = document.getElementById(id);
        Common.mask(element, id + "-mask");
      } else {
        Common.mask(document.body, "body-mask");
      }
    }
    var headers = {};
    headers.Authorization = "Bearer " + gIdentityAccessToken;
    $.ajax({
      url: url,
      type: "POST",
      data: params,
      headers: typeof headers !== "undefined" ? headers : "",
    })
      .done(function (data, textStatus, request) {
        if (request.getResponseHeader("LoginPage") !== null) {
          location.reload(true);
        }
        if (typeof successHandler === "function") {
          successHandler(data);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        if (typeof errorHandler === "function") {
          errorHandler(errorThrown, jqXHR);
        }
      })
      .always(function () {
        if (showMask) {
          if (id !== undefined && id !== null) {
            Common.unmask(id + "-mask");
          } else {
            Common.unmask("body-mask");
          }
        }
      });
  };
  E.objectToFormData = function (formData, params, name) {
    name = name || "";
    if (
      typeof params === "object" &&
      !(params instanceof File) &&
      !(params instanceof Blob)
    ) {
      Object.keys(params).forEach(function (key) {
        const value = params[key];
        if (name === "") {
          Common.objectToFormData(formData, value, key);
        } else {
          Common.objectToFormData(formData, value, `${name}[${key}]`);
        }
      });
    } else {
      if (params instanceof Blob) {
        formData.append(name, params, params.name);
      } else {
        formData.append(name, params);
      }
    }
  };
  E.ajaxPostWithFile = function (
    url,
    params,
    successHandler,
    errorHandler,
    showMask,
    id
  ) {
    //id of the mask location
    if (showMask) {
      if (id !== undefined && id !== null) {
        var element = document.getElementById(id);
        Common.mask(element, id + "-mask");
      } else {
        Common.mask(document.body, "body-mask");
      }
    }
    var model = new FormData();
    Common.objectToFormData(model, params);
    var headers = {};
    headers.Authorization = "Bearer " + gIdentityAccessToken;
    $.ajax({
      url: url,
      type: "POST",
      processData: false,
      contentType: false,
      data: model,
      headers: typeof headers !== "undefined" ? headers : "",
    })
      .done(function (data, textStatus, request) {
        if (request.getResponseHeader("LoginPage") !== null) {
          location.reload(true);
        }
        if (typeof successHandler === "function") {
          successHandler(data);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        if (typeof errorHandler === "function") {
          errorHandler(errorThrown);
        }
      })
      .always(function () {
        if (showMask) {
          if (id !== undefined && id !== null) {
            Common.unmask(id + "-mask");
          } else {
            Common.unmask("body-mask");
          }
        }
      });
  };
  E.ajaxGet = function (
    url,
    params,
    successHandler,
    errorHandler,
    showMask,
    id,
    async //id of the mask location
  ) {
    if (typeof async === "undefined" || async === null) {
      async = true;
    }
    if (showMask) {
      if (id !== undefined && id !== null) {
        var element = document.getElementById(id);
        Common.mask(element, id + "-mask");
      } else {
        Common.mask(document.body, "body-mask");
      }
    }
    var headers = {};
    headers.Authorization = "Bearer " + gIdentityAccessToken;
    $.ajax({
      url: url,
      type: "GET",
      data: params,
      async: async,
      headers: typeof headers !== "undefined" ? headers : "",
    })
      .done(function (data, textStatus, request) {
        if (request.getResponseHeader("LoginPage") !== null) {
          location.reload(true);
        }
        if (typeof successHandler === "function") {
          successHandler(data);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        if (typeof errorHandler === "function") {
          errorHandler(errorThrown, jqXHR);
        }
      })
      .always(function () {
        if (showMask) {
          if (id !== undefined && id !== null) {
            Common.unmask(id + "-mask");
          } else {
            Common.unmask("body-mask");
          }
        }
      });
  };
  E.dataURItoBlob = function (dataURI) {
    if (!isClient) return null;

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  };
  return E;
})(Common || {});

export default Common;
