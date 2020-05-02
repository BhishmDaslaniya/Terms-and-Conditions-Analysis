/* ----- Custom Scripts for Kaline template ----- */
jQuery(function($) {
  ("use strict");

  /*-----------------------------------
  ----------- Scroll To Top -----------
  ------------------------------------*/

  $(window).scroll(function() {
    if ($(this).scrollTop() > 500) {
      $("#back-top").fadeIn();
    } else {
      $("#back-top").fadeOut();
    }
  });

  //Jarallax Init//

  $(".intro").jarallax({
    speed: 0.5
  });

  /*----- Preloader ----- */

  $(window).load(function() {
    setTimeout(function() {
      $("#loading").fadeOut("slow", function() {});
    }, 100);
  });

  /* --------- Wow Init -------*/

  new WOW().init();

  /*----------------------------
------- Isotope Init -------
-----------------------------*/

  $(window).load(function() {
    var data;
    var pstr = "";

    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:5500/data.json",
      async: false,
      beforeSend: function(xhr) {
        if (xhr && xhr.overrideMimeType) {
          xhr.overrideMimeType("application/json;charset=utf-8");
        }
      },
      dataType: "json",
      success: function(d) {
        data = d;
        //Do stuff with the JSON data
        // console.log(Object.keys(data).length);
      }
    });

    $("#search").on("keyup", function() {
      $(".portfolio_container").empty();
      var valueT = $(this)
        .val()
        .toLowerCase();
      //   console.log(value);
      pstr = "";

      results = [];
      for (key in data) {
        // console.log(key);

        var tmpkey = key;

        var name = tmpkey.replace("tosdr/review/", "");

        if (name.toLowerCase().includes(valueT.toLowerCase())) {
          if (!data[key]["see"]) {
            results.push(key);
          }
        }
      }

      for (var result of results) {
        companyData = data[result];

        // console.log(companyData);
        // add elements
        var obj = companyData;
        var logo = obj["logo"];
        var name = obj["name"];
        var points = obj["points"];

        for (i in points) {
          if (i <= 2) {
            let exp = "";
            if (points[i]["point"] === "neutral") {
              exp = "meh";
            } else if (points[i]["point"] === "bad") {
              exp = "thumbs-down";
            } else if (points[i]["point"] === "good") {
              exp = "thumbs-up";
            }
            pstr += `<li class='list__item'>
                              <i class='far fa-${exp}' style='margin-right: 10px;'></i>
                              <span class='list__item__text'>${points[i]["title"]}</span>
                            </li>`;
          }
        }
        $(".portfolio_container")
          .append(`<div class='custompadding col-sm-6  design'>
                  <div class='shadow'>
                    <div class='card'>
                      <div class='card-header'>
                        <span>
                          <img width='75' src='${logo}' alt='' style="margin-right: 10px"/>
                        </span>
                        <span class='product-title'>
                          <b>  ${name}</b>
                          <span class='badge'>
                          Threat ${rated}
                          </span>
                        </span>
                      </div>
                      <div class='card-body'>
                        <dl>
                          <ul class='list'>
                            ${pstr}
                          </ul>
                        </dl>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>`);
      }
      return;

      //   console.log(valueT.includes("o"));
      $(".portfolio_container").empty();
      for (key in data) {
        var obj = data[key];
        var logo = obj["logo"];
        var name = obj["name"];
        var points = obj["points"];
        // console.log(obj["slug"]);
        if (obj["see"] === undefined) {
          if (obj["name"].includes(valueT) === true) {
            for (i in points) {
              if (i <= 2) {
                let exp = "";
                if (points[i]["point"] === "neutral") {
                  exp = "meh";
                } else if (points[i]["point"] === "bad") {
                  exp = "thumbs-down";
                } else if (points[i]["point"] === "good") {
                  exp = "thumbs-up";
                }
                pstr += `<li class='list__item'>
                              <i class='far fa-${exp}' style='margin-right: 10px;'></i>
                              <span class='list__item__text'>${points[i]["title"]}</span>
                            </li>`;
              }
            }
          }
        }
        $(".portfolio_container")
          .append(`<div class='custompadding col-sm-6  design'>
                  <div class='shadow'>
                    <div class='card'>
                      <div class='card-header'>
                        <span>
                          <img width='75' src='${logo}' alt='' style="margin-right: 10px"/>
                        </span>
                        <span class='product-title'>
                          <b>  ${name}</b>
                          <span class='badge'>
                          Threat ${rated}
                          </span>
                        </span>
                      </div>
                      <div class='card-body'>
                        <dl>
                          <ul class='list'>
                            ${pstr}
                          </ul>
                        </dl>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>`);
      }
    });

    // console.log(Object.keys(data).length);
    // console.log(data["tosdr/review/10minutemail.com"]);
    // var c = 0;
    // var fdata = {};
    // var temp = {};
    // for (i in data) {
    //   if (data[i]["see"] === undefined) {
    //       fdata[i] = data[i];
    //   } else {
    //     temp[i] = data[i];
    //   }
    // }
    // console.log(Object.keys(fdata).length);

    var $container = $(".portfolio_container");
    $container.isotope({
      filter: "*"
    });

    var newData = {};

    for (i in data) {
      obj = data[i];
      if (obj["see"] === undefined && obj["rated"] !== false) {
        let score = 0;
        obj["points"].map(z => {
          if (typeof z["score"] === "string") {
            score += parseInt(z["score"]);
          } else {
            score += z["score"];
          }
        });
        score /= obj["points"].length;
        obj["score"] = score;
        newData[i] = obj;
        // console.log(obj["name"], score, obj["points"].length);
        // console.log(obj);
        //   .sort(function(a, b){return b - a});
      }
    }
    // newData.sort(function(a, b) {
    //   return b["score"] - a["score"];
    // });
    // console.log(newData);

    var sortable = [];
    for (let key in newData) {
      sortable.push([key, newData[key]]);
    }
    sortable.sort(function(a, b) {
      //   console.log(b[1]["rated"] - a[1]["rated"]);
      return a[1]["rated"].charCodeAt(0) - b[1]["rated"].charCodeAt(0);
    });
    // console.log(sortable);

    for (key in sortable) {
      obj = sortable[key][1];
      if (obj["see"] === undefined && obj["rated"]) {
        logo = obj["logo"];
        name = obj["name"];
        points = obj["points"];
        var rated = obj["rated"];
        for (i in points) {
          console.log(parseInt(i) <= 2);
          if (parseInt(i) <= 2) {
            let exp = "";
            // console.log(typeof i);
            if (points[i]["point"] === "neutral") {
              exp = "meh";
            } else if (points[i]["point"] === "bad") {
              exp = "thumbs-down";
            } else if (points[i]["point"] === "good") {
              exp = "thumbs-up";
            }
            pstr += `<li class='list__item'>
                              <i class='far fa-${exp}' style='margin-right: 10px;'></i>
                              <span class='list__item__text'>${points[i]["title"]}</span>
                            </li>`;
          }
        }
        $(".portfolio_container")
          .append(`<div class='custompadding col-sm-6  design'>
                  <div class='shadow'>
                    <div class='card'>
                      <div class='card-header'>
                        <span>
                          <img width='75' src='${logo}' alt='' style="margin-right: 10px"/>
                        </span>
                        <span class='product-title'>
                          <b>  ${name}</b>
                          <span class='badge'>
                          Threat ${rated}
                          </span>
                        </span>
                      </div>
                      <div class='card-body'>
                        <dl>
                          <ul class='list'>
                            ${pstr}
                          </ul>
                        </dl>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>`);
      } else {
      }
    }

    // for (i in data) {
    //   obj = data[i];
    //   if (obj["see"] === undefined && obj["rated"]) {
    //     logo = data[i]["logo"];
    //     name = obj["name"];
    //     points = obj["points"];
    //     var rated = obj["rated"];
    //     var pstr = "";
    //     for (i in points) {
    //       if (i <= 2) {
    //         let exp = "";
    //         if (points[i]["point"] === "neutral") {
    //           exp = "meh";
    //         } else if (points[i]["point"] === "bad") {
    //           exp = "thumbs-down";
    //         } else if (points[i]["point"] === "good") {
    //           exp = "thumbs-up";
    //         }
    //         pstr += `<li class='list__item'>
    //                           <i class='far fa-${exp}' style='margin-right: 10px;'></i>
    //                           <span class='list__item__text'>${points[i]["title"]}</span>
    //                         </li>`;
    //       }
    //     }
    //     $(".portfolio_container")
    //       .append(`<div class='custompadding col-sm-6  design'>
    //               <div class='shadow'>
    //                 <div class='card'>
    //                   <div class='card-header'>
    //                     <span>
    //                       <img width='75' src='${logo}' alt='' style="margin-right: 10px"/>
    //                     </span>
    //                     <span class='product-title'>
    //                       <b>  ${name}</b>
    //                       <span class='badge'>
    //                       Class ${rated}
    //                       </span>
    //                     </span>
    //                   </div>
    //                   <div class='card-body'>
    //                     <dl>
    //                       <ul class='list'>
    //                         ${pstr}
    //                       </ul>
    //                     </dl>
    //                   </div>
    //                 </div>
    //               </div>
    //               </a>
    //             </div>`);
    //   } else {
    //   }
    // }

    // $(
    //   ".portfolio_container"
    // ).append(`<div class='custompadding col-sm-6  design'>
    //               <div class='shadow'>
    //                 <div class='card'>
    //                   <div class='card-header'>
    //                     <span>
    //                       <img width='75' src='https://tosdr.org/logo/google.png' alt='' />
    //                     </span>
    //                     <span class='product-title'>
    //                       <b>Yahoo</b>
    //                       <span class='badge'>
    //                       </span>
    //                     </span>
    //                   </div>
    //                   <div class='card-body'>
    //                     <dl>
    //                       <ul class='list'>
    //                         <li class='list__item'>
    //                           <i class='far fa-thumbs-up' style='margin-right: 10px;'></i>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <i class='far fa-meh' style='margin-right: 10px;'></i>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <i class='far fa-thumbs-down' style='margin-right: 10px;'></i>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                         <li class='list__item'>
    //                           <span class='list__item__text'>Single Line Item</span>
    //                         </li>
    //                       </ul>
    //                     </dl>
    //                   </div>
    //                 </div>
    //               </div>
    //               </a>
    //             </div>`);

    $(".origin-portfolio_filter a").on("click", function() {
      $(".origin-portfolio_filter .active").removeClass("active");
      $(this).addClass("active");

      var selector = $(this).attr("data-filter");
      $container.isotope({
        filter: selector,
        animationOptions: {
          duration: 500,
          animationEngine: "jquery"
        }
      });
      return false;
    });
  });
});
