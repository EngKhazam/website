$(document).ready(function () {
  // Function to load language file
  function loadLanguageResources(lang, callback) {
    $.ajax({
      url: `resources/lang/${lang}.json`, // Adjust the path to where your JSON files are located
      dataType: "json",
      success: function (data) {
        callback(data);
      },
      error: function () {
        console.error(`Could not load ${lang}.json`);
      },
    });
  }

  // Initialize i18next
  i18next.init(
    {
      lng: "en", // default language
      debug: true, // set to false in production
      resources: {},
    },
    function (err, t) {
      // Initialize your application
      updateContent();
    }
  );

  // Load English and Arabic resources
  loadLanguageResources("en", function (enTranslations) {
    i18next.addResourceBundle("en", "translation", enTranslations);
  });
  loadLanguageResources("ar", function (arTranslations) {
    i18next.addResourceBundle("ar", "translation", arTranslations);
  });

  // Function to update the content based on the current language
  function updateContent() {
    $("[data-i18n]").each(function () {
      var key = $(this).data("i18n");
      $(this).text(i18next.t(key));
    });
  }

  // Language switcher event
  $("#languageSwitcher").on("change", function () {
    i18next.changeLanguage($(this).val(), function () {
      updateContent();
    });
  });
});
