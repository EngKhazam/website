$(document).ready(function () {
  // Array of CSS file URLs
  var cssFiles = [
    "/website/css/styles.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  ];

  // Array of JS file URLs
  var jsFiles = [
    "https://code.jquery.com/jquery-3.7.1.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/i18next/23.7.16/i18next.min.js",
    "/website/js/navbar.js",
    "/website/resources/lang/multilanguages.js",
  ];

  // Loop over CSS files and add them to the head
  cssFiles.forEach(function (href) {
    var cssLink = $("<link>").attr({
      rel: "stylesheet",
      type: "text/css",
      href: href,
    });
    $("head").append(cssLink);
  });

  // Loop over JS files and add them to the end of the body
  jsFiles.forEach(function (src) {
    var script = $("<script>").attr({
      type: "text/javascript",
      src: src,
    });
    $("body").append(script); // or $("head").append(script) if you prefer it in the head
  });
});
