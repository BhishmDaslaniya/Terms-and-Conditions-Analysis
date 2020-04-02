chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var host = new URL(tabs[0].url).host;
    // document.write(url)
    showTerms = false;
    
    $('#termsview').css('display', 'none')
    $('#qaview').css('display', 'none')
    if (showTerms){
        $('#termsview').css('display', 'flex')
    } else {
        $('#termsview').css('display', 'flex')
    }

    $('#text').text('')

    $('#ask').click(()=>{
        var s = $('#text').text()
        var q = $('#q').val()
        console.log(s)
        console.log(q)

        var data = 'ip=203.109.74.66&Paragraph=' + encodeURIComponent(s) + '&Question1=' 
            + encodeURIComponent(q) + '&Question2=&Question3=&Question4=&Question5='

        $.ajax({
            url: "https://localhost:5000/submitted",
            type: "post",
            data: data,
            withCredetials: true,
            success: function(d) {
                console.log(d);
                $('#ans').text(d)
            },
            error: function(){
                console.log('error')
            }
        });

        // alert(s + ' ' + q)
    })

    setTimeout(() => {
        console.log('started!');
        $('#tabbutton').click(()=>{
            onchangetab()
        })
        var tmp = '.' + host;
        var notfound = true;
        if (['newtab'].indexOf(host) >= 0) {
        } else {
            while (tmp.indexOf('.') >= 0) {
                console.log(tmp);
                var i = tmp.indexOf('.');
                tmp = tmp.substr(i + 1);
                console.log('FOUND!');
                if (data['tosdr/review/' + tmp]) {
                    // updateUI(tmp)
                    console.log('FOUND!');
                    updateUI(data['tosdr/review/' + tmp], tmp);
                    notfound = false;
                }
            }
        }
        if (notfound) {
            notfound = `
            <div style="text-align: center; padding-right: 100px; margin-top: 170px;">    
                <h3>&#x1F628;</h3>
                <h3>not found!</h3>
            </div>   
            `;
            $('#accordion').html(notfound);
        }
        // updateUI(data)
    }, 500);
});


function ask(q){

}


function onchangetab(){
    $('#termsview').css('display', 'none')
    $('#qaview').css('display', 'none')

    if (showTerms){
        $('#termsview').css('display', 'flex')
    } else {
        $('#qaview').css('display', 'flex')
    }
    if (showTerms){
        $('#tabbutton').text('Terms')
    } else {
        $('#tabbutton').text('QA')
    }
    showTerms = !showTerms;

    // alert(1)
}

// -----------------------------------------------------------------------

// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
//     // document.write(url)
// });

function addItem(title, desc, score, point, color, emoji) {
    var id = Math.round(Math.random() * 50000);
    if (!color) color = 'grey';
    if (!emoji) emoji = '';
    $('#text').text(($('#text').text() + ' ' + desc).trim())
    
    var html = `<div class="card">
    <div class="card-header" id="headingOne${id}" style="display: flex; flex-direction: row;">
        <!-- div style="height: 10px; width: 10px; background: ${color}; 
            border-radius: 50%; margin-bottom: auto; margin-top: auto; opacity: 0.7"></div -->                                    
        <div style="height: 10px; width: 10px; 
            border-radius: 50%; margin-bottom: auto; margin-top: 8px; opacity: 0.7">
            ${emoji} &nbsp;
            </div >                                    


        <h5 class="mb-0">
          
            <a
                class="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseOne${id}"
                aria-expanded="false"
                style="text-align: left"
                aria-controls="collapseOne${id}"
                href="javascript:void(0)"
            >
                ${title} 
            </a>
        </h5>
    </div>

    <!-- class="collapse show" -->
    <div
      id="collapseOne${id}"
      class="collapse"
      aria-labelledby="headingOne${id}"
      data-parent="#accordion"
    >
      <b style="padding: 1.25rem; margin-top: 10px">Points: ${score} (${point})</b>
        <div class="card-body">
            ${desc}
        </div>
    </div>
  </div>`;

    $('#accordion').html($('#accordion').html() + html);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var showTerms = false;


function removeStop(x){
    var s = ["Generated through the annotate view"]
    if (s.indexOf(x) >= 0){
        return ''
    }
    return s
}


function updateUI(obj, host) {
    $('#accordion').html('');
    console.log(obj)

    var pointsData = obj['pointsData'];
    if (!pointsData) {
        pointsData = obj['points'];
    }
    try {
        if (obj['slug']) {
            $('#title').text(obj['slug'].capitalize());
        } else {
            $('#title').text(host.capitalize());
        }
    } catch (e) {
        $('#title').text(host.capitalize());
    }
    setTimeout(() => {
        for (var x of pointsData) {
            // var point = pointsData[x]
            var extracted = x; // point['tosdr']

            var _summary = extracted['title'];
            var _point = extracted['point'];
            var _score = extracted['score'];
            var _desc = extracted['description'];
            if (_desc == 'Generated through the annotate view') {
                _desc = '';
            }

            var colors = {
                neutral: 'gray',
                bad: 'red',
                blocker: 'red',
                good: 'green'
            };

            var emoji = {
                neutral: '&#x1F610;', //'😐',
                bad: '&#x1F621;', //'😡',
                blocker: '&#x1F608;', //'😈',
                good: '&#x1F607;' //'😇'
            };

            addItem(
                _summary,
                _desc,
                _score,
                _point,
                colors[_point],
                emoji[_point]
            );
        }
    }, 1000);
}
