/* Tres Marias — ordering page (front-end only, no backend) */
(function () {
  "use strict";

  var list = document.querySelector(".orderlist");
  if (!list) return;

  var items = Array.prototype.slice.call(document.querySelectorAll(".oitem"));
  var cartList = document.getElementById("cartList");
  var cartEmpty = document.getElementById("cartEmpty");
  var cartTotal = document.getElementById("cartTotal");
  var notice = document.getElementById("notice");
  var placeBtn = document.getElementById("placeOrder");
  var modeHint = document.getElementById("modeHint");
  var mode = "pickup";

  function money(n) {
    return "$" + n.toFixed(2);
  }

  function render() {
    var rows = "";
    var total = 0;
    var count = 0;
    var askItems = 0;

    items.forEach(function (item) {
      var n = parseInt(item.querySelector("[data-qty-n]").textContent, 10) || 0;
      if (!n) return;
      var name = item.getAttribute("data-name");
      var price = parseFloat(item.getAttribute("data-price")) || 0;
      count += n;

      if (price <= 0) {
        askItems += n;
        rows += '<li class="is-ask"><span class="cart__name"><b>' + name +
          '</b></span><span class="cart__qty">×' + n + '</span><span class="cart__amt">Ask</span></li>';
      } else {
        var line = price * n;
        total += line;
        rows += '<li><span class="cart__name"><b>' + name +
          '</b></span><span class="cart__qty">×' + n + '</span><span class="cart__amt">' +
          money(line) + "</span></li>";
      }
    });

    cartList.innerHTML = rows;
    cartEmpty.style.display = count ? "none" : "block";
    cartTotal.textContent = money(total);
    cartList.setAttribute("data-ask", askItems);
  }

  /* qty steppers */
  items.forEach(function (item) {
    var out = item.querySelector("[data-qty-n]");
    item.querySelectorAll(".qty__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var step = parseInt(btn.getAttribute("data-step"), 10);
        var n = Math.max(0, (parseInt(out.textContent, 10) || 0) + step);
        out.textContent = n;
        render();
      });
    });
  });

  /* category filter */
  document.querySelectorAll(".otab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".otab").forEach(function (t) { t.classList.remove("is-on"); });
      tab.classList.add("is-on");
      var cat = tab.getAttribute("data-cat");
      items.forEach(function (item) {
        var match = cat === "all" || item.getAttribute("data-cat") === cat;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* pickup / delivery */
  document.querySelectorAll(".toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".toggle__btn").forEach(function (b) { b.classList.remove("is-on"); });
      btn.classList.add("is-on");
      mode = btn.getAttribute("data-mode");
      modeHint.textContent = mode === "pickup"
        ? "Pick-up at the drive-thru on Telephone Rd. Ready in about 20 minutes."
        : "Delivery runs through DoorDash — ordering here is for pick-up only for now.";
    });
  });

  /* place order (preview) */
  placeBtn.addEventListener("click", function () {
    var count = parseInt(cartList.getAttribute("data-ask"), 10) || 0;
    var total = cartTotal.textContent;
    var nameEl = document.getElementById("oname");
    var name = nameEl && nameEl.value.trim() ? nameEl.value.trim().split(" ")[0] : "";
    var lines = cartList.querySelectorAll("li").length;
    var askN = parseInt(cartList.getAttribute("data-ask"), 10) || 0;

    var msg;
    if (!lines) {
      msg = "Your cart is empty — tap a + next to something you want and try again.";
    } else {
      msg = "Thanks" + (name ? ", " + name : "") + " — this ordering page is a preview, so nothing was sent to the kitchen. ";
      msg += "Your cart comes to <b>" + total + "</b>" +
        (askN ? " plus <b>" + askN + "</b> item(s) priced at the counter" : "") + ". ";
      msg += "Call <b>(713) 987-9391</b> to place it for real, or order on DoorDash.";
    }
    notice.innerHTML = msg;
    notice.classList.add("is-on");
    notice.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  render();
})();
