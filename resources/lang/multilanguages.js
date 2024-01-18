//$(document).ready(function () {
$.getScript(
  "https://cdnjs.cloudflare.com/ajax/libs/i18next/23.7.16/i18next.min.js",
  function () {
    var userLang = localStorage.getItem("selectedLanguage");
    console.log("userLang: " + userLang);
    // Function to load language file
    function loadLanguageResources(lang, callback) {
      $.ajax({
        url: `/website/resources/lang/${lang}.json`, // Adjust the path to where your JSON files are located
        dataType: "json",
        success: function (data) {
          callback(data);
        },
        error: function () {
          console.error(`Could not load ${lang}.json`);
        },
      });
    }
    if (!userLang) {
      userLang = "en";
    }

    // Initialize i18next
    i18next.init(
      {
        lng: userLang, // default language
        debug: true, // set to false in production
        resources: {},
      },
      function (err, t) {
        // Initialize your application
        updateContentLangauge();
      }
    );

    // Load English and Arabic resources
    loadLanguageResources("en", function (enTranslations) {
      i18next.addResourceBundle("en", "translation", enTranslations);

      // Change i18next language
      i18next.changeLanguage(userLang, function () {
        updateContentLangauge();
      });
    });
    loadLanguageResources("ar", function (arTranslations) {
      i18next.addResourceBundle("ar", "translation", arTranslations);

      // Change i18next language
      i18next.changeLanguage(userLang, function () {
        updateContentLangauge();
      });
    });

    $("#languageSwitcher .dropdown-item").on("click", function () {
      var selectedLanguage = $(this).data("i18n"); // Assuming 'data-i18n' holds the language code

      // Change i18next language
      i18next.changeLanguage(selectedLanguage, function () {
        updateContentLangauge();
      });

      localStorage.setItem("selectedLanguage", selectedLanguage);
    });

    if (i18next) {
      console.log("i18next is ready");
      updateContentLangauge();
    } else {
      console.log("i18next is not");
    }
  }
);

// Function to update the content based on the current language
function updateContentLangauge() {
  $("[data-i18n]").each(function () {
    var key = $(this).data("i18n");
    $(this).text(i18next.t(key));
  });
}
