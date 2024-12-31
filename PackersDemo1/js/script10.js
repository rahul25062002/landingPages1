var Formoid = (function () {
  var e = function (e, t) {
      return (
        (e = "__" + e + "__"), t.length ? ((this[e] = t[0]), this) : this[e]
      );
    },
    t = function (e) {
      (e = e || {}),
        (this.__email__ = e.email || ""),
        (this.__title__ = e.title || ""),
        (this.__data__ = e.data || []);
    };
  return (
    (t.prototype.email = function (t) {
      return e.call(this, "email", arguments);
    }),
    (t.prototype.title = function (t) {
      return e.call(this, "title", arguments);
    }),
    (t.prototype.data = function (t) {
      return e.call(this, "data", arguments);
    }),
    (t.prototype.send = function (e) {
      return ((t = "https://formoid.net/api/push"),
      (o = {
        type: "POST",
        data: JSON.stringify({
          email: this.__email__,
          form: {
            title: this.__title__,
            data: arguments.length ? e : this.__data__,
          },
        }),
      }),
      new Promise(function (e, n) {
        var r = new XMLHttpRequest();
        r.open(o.type, t),
          (r.onload = function () {
            if (200 !== r.status)
              return n(new Error("Incorrect server response."));
            e(r.responseText);
          }),
          (r.onerror = function () {
            var e = "Failed to query the server. ";
            "onLine" in navigator && !navigator.onLine
              ? (e += "No connection to the Internet.")
              : (e += "Check the connection and try again."),
              n(new Error(e));
          }),
          r.send(o.data);
      })).then(function (e) {
        var t;
        try {
          t = JSON.parse(e);
        } catch (e) {
          throw new Error("Incorrect server response.");
        }
        if (t.error) throw new Error(t.error);
        return t.response;
      });
      var t, o;
    }),
    {
      Form: function (e) {
        return new t(e);
      },
    }
  );
})();
const formModalDOM = document.createElement("div");
let formModal;
formModalDOM.classList.add("modal"),
  formModalDOM.setAttribute("tabindex", -1),
  (formModalDOM.style.overflow = "hidden"),
  "undefined" != typeof bootstrap
    ? bootstrap.Tooltip.VERSION.startsWith(5)
      ? (formModalDOM.innerHTML =
          '\n            <div class="modal-dialog d-flex align-items-center" style="">\n                <div class="modal-content" style="height:auto;border-radius:0;border:none;box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);">\n                    <div class="modal-body d-flex justify-content-end flex-column align-items-end">\n                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                        <p class="display-7" style="text-align:center;width:100%;">Modal body text goes here.</p>\n                    </div>\n                </div>\n            </div>')
      : (formModalDOM.innerHTML =
          '\n            <div class="modal-dialog d-flex align-items-center" style="">\n                <div class="modal-content" style="height:auto;border-radius:0;border:none;box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);">\n                    <div class="modal-body d-flex justify-content-end flex-column align-items-end">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                        <p class="display-7" style="text-align:center;width:100%;">Modal body text goes here.</p>\n                    </div>\n                </div>\n            </div>')
    : $.fn.Tooltip &&
      (formModalDOM.innerHTML =
        '\n        <div class="modal-dialog d-flex align-items-center" style="">\n            <div class="modal-content" style="height:auto;border-radius:0;border:none;box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);">\n                <div class="modal-body d-flex justify-content-end flex-column align-items-end">\n                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                    <p class="display-7" style="text-align:center;width:100%;">Modal body text goes here.</p>\n                </div>\n            </div>\n        </div>'),
  bootstrap && (formModal = new bootstrap.Modal(formModalDOM));
var isValidEmail = function (e) {
    return (
      !e.value ||
      /^([^@]+?)@(([a-z0-9]-*)*[a-z0-9]+\.)+([a-z0-9]+)$/i.test(e.value)
    );
  },
  formComponents = document.querySelectorAll('[data-form-type="formoid"]');
formComponents.forEach(function (e) {
  var t,
    o = "FORM" === e.tagName ? e : e.querySelector("form"),
    n = e.querySelector("[data-form-alert]"),
    r = e.getAttribute("data-form-title")
      ? e
      : e.querySelector("[data-form-title]"),
    a = e.querySelector('[type="submit"]'),
    l = e.querySelectorAll("[data-form-field]"),
    i = n.innerHTML;
  o.addEventListener("change", function (e) {
    "file" === e.target.type &&
      e.target.files[0].size > 1e6 &&
      ((formModal._element.querySelector(".modal-body p").innerText =
        "File size must be less than 1mb"),
      formModal._element
        .querySelector(".modal-content")
        .classList.add("alert-danger"),
      (formModal._element.querySelector(
        ".modal-content"
      ).style.backgroundColor = "#ff9966"),
      formModal.show(),
      a.classList.add("btn-loading"),
      a.setAttribute("disabled", !0));
  }),
    o.addEventListener("submit", function (s) {
      if (
        (s.stopPropagation(),
        s.preventDefault(),
        !a.classList.contains("btn-loading"))
      ) {
        var d = l;
        o.classList.add("form-active"),
          a.classList.add("btn-loading"),
          a.setAttribute("disabled", !0),
          (n.innerHTML = ""),
          (t =
            t ||
            Formoid.Form({
              email: e.querySelector("[data-form-email]").value,
              title: r.getAttribute("data-form-title") || r.innerText,
            })),
          Promise.all(
            Array.prototype.map.call(d, function (e) {
              return (function (e) {
                return new Promise(function (t, o) {
                  if ("email" === e.getAttribute("name") && !isValidEmail(e))
                    return o(new Error("Form is not valid"));
                  var n =
                    e.getAttribute("data-form-field") || e.getAttribute("name");
                  switch (e.getAttribute("type")) {
                    case "file":
                      var r = e.files[0];
                      if (!r) return t();
                      var a = new FileReader();
                      (a.onloadend = function () {
                        t([n, a.result]);
                      }),
                        (a.onerror = function () {
                          o(a.error);
                        }),
                        a.readAsDataURL(r);
                      break;
                    case "checkbox":
                      t([n, e.checked ? e.value : "No"]);
                      break;
                    case "radio":
                      t(e.checked && [n, e.value]);
                      break;
                    default:
                      t([n, e.value]);
                  }
                });
              })(e);
            })
          )
            .then(function (e) {
              return t.send(
                e.filter(function (e) {
                  return e;
                })
              );
            })
            .then(
              function (e) {
                o.reset(),
                  o.classList.remove("form-active"),
                  (formModal._element.querySelector(".modal-body p").innerText =
                    i || e),
                  formModal._element
                    .querySelector(".modal-content")
                    .classList.add("alert-success"),
                  (formModal._element.querySelector(
                    ".modal-content"
                  ).style.backgroundColor = "#70c770"),
                  formModal.show();
              },
              function (e) {
                (formModal._element.querySelector(".modal-body p").innerText =
                  e.message),
                  formModal._element
                    .querySelector(".modal-content")
                    .classList.add("alert-danger"),
                  (formModal._element.querySelector(
                    ".modal-content"
                  ).style.backgroundColor = "#ff9966");
              }
            )
            .then(function () {
              a.classList.remove("btn-loading"), a.removeAttribute("disabled");
            });
      }
    }),
    l.forEach(function (e) {
      e.addEventListener("focus", function () {
        a.classList.remove("btn-loading"), a.removeAttribute("disabled");
      });
    });
});
