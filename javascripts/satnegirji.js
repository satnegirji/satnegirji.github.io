

$(document).ready( function() {

  var results_template = $('#results-template').text();
  var results_row = $('#results-row').text();
  var word_template = $('#word-template').text();
  var translations_template = $('#translations-template').text();
  var inner_page = $('#inner-page');

  var build_results = function(results) {
    inner_page.empty();
    var inner_buf = "";
    $.each(results, function(i, row) {
      inner_buf += nano( results_row, row);
    });
    inner_page.append( nano(results_template, {results: inner_buf} ));
  }
  var build_translation = function(word, translations) {
    inner_page.empty();
    var translations_buf = "";
    $.each(translations, function(i, item) {
      translations_buf += nano( translations_template, item);
    });
    inner_page.append( nano(word_template, {body: word.body, language: word.language, translations: translations_buf}));
  }
  var api_url = "http://api.satnegirji.org";
  $('form').on('submit', function(ev) {
    ev.preventDefault();
    var values = $(this).serializeArray();
    var term = values[0].value;
    if(term && term.length > 0)
    {
      var resource_url = api_url + "/search?query=" + term;
      console.log("  resource_url:", resource_url);
      $.ajax({
        url: resource_url,
        method: "GET",
        dataType: "JSON",
        error: function(jqXHR, textStatus, errorThrown ) {
          console.log("====================================");
          console.log("error throw:", errorThrown);
          console.log("text status:", textStatus);
          console.log("====================================");
        },
        success: function(data, textStatus, jqXHR) {
          router.navigate("");
          build_results(data['results']);
        }
      });
    }
    return false;
  })

  var router = new Navigo();
  router.on({
    '/word/:id': function(params) {
      var id = params.id.replace(/\D/g,'');
      $.ajax({
        url: api_url+"/word?id="+id,
        method: "GET",
        dataType: "JSON",
        success: function(data, textStatus, jqXHR) {
          build_translation(data, data.translations);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("====================================");
          console.log("error throw:", errorThrown);
          console.log("text status:", textStatus);
          console.log("====================================");
        }
      })
    },
    '*': function(params) {
      inner_page.empty();

    }
  });

});
