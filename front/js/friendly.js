window.addEventListener('load', function () {
	var keyword = '서울';
	var page = 1;
	var contentTypeId = 1145;
	var areaCode = 1;
	performSearch(keyword, page, contentTypeId, areaCode);
});

var form = document.querySelector('form');
var keywordInput = document.getElementById('keywordInput');
var contentTypeIdSelect = document.getElementById('contentTypeIdSelect');
var areaCodeSelect = document.getElementById('areaCodeSelect');
var responseContainer = document.getElementById('responseContainer');
var paginationContainer = document.getElementById('paginationContainer');

form.addEventListener('submit', function (event) {
	event.preventDefault();
	var keyword = keywordInput.value.trim();
	if (keyword === '') {
		return;
	}

	var currentPage = 1;
	var contentTypeId = contentTypeIdSelect.value;
	var areaCode = areaCodeSelect.value;
	performSearch(keyword, currentPage, contentTypeId, areaCode);
});

function performSearch(keyword, page, contentTypeId, areaCode) {
	var xhr = new XMLHttpRequest();
	var apiKey =
		'RY86xHRwOGsZ8K3FWKxwqE6zjJxf7cW0/MILj2JgqZFmG2AB9K45mP1RiyePy23jhtmXL6us4GtOXUFb0RIIzg==';
	var url = 'https://apis.data.go.kr/B551011/ForFriTourService/searchKeyword';
	var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKey;
	queryParams +=
		'&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('etc');
	queryParams +=
		'&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('etc');
	queryParams +=
		'&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(keyword);
	queryParams +=
		'&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');
	queryParams +=
		'&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
	queryParams +=
		'&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(page);
	queryParams +=
		'&' +
		encodeURIComponent('contentTypeId') +
		'=' +
		encodeURIComponent(contentTypeId);
	queryParams +=
		'&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(areaCode);

	xhr.open('GET', url + queryParams, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var data = JSON.parse(xhr.responseText);
			var items = data.response.body.items.item;

			var html = '';
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var title = item.title;
				var contentid = item.contentid;
				var contenttypeid = item.contenttypeid; //관광타입(1145:음식 , 1146:기도실)
				var addr1 = item.addr1;
				var cat1 = item.cat1;
				var areacode = parseInt(item.areacode);

				var firstimage = item.firstimage;
				var firstimage2 = item.firstimage2;
				var areaname = ''; // 번호에 맞는 한글 지역명을 저장할 변수

				switch (areacode) {
					case 1:
						areaname = '서울특별시';
						break;
					case 2:
						areaname = '인천광역시';
						break;
					case 3:
						areaname = '대전광역시';
						break;
					case 4:
						areaname = '대구광역시';
						break;
					case 5:
						areaname = '광주광역시';
						break;
					case 6:
						areaname = '부산광역시';
						break;
					case 7:
						areaname = '울산광역시';
						break;
					case 8:
						areaname = '세종특별자치시';
						break;
					case 31:
						areaname = '경기도';
						break;
					case 32:
						areaname = '강원도';
						break;
					case 33:
						areaname = '충청북도';
						break;
					case 34:
						areaname = '충청남도';
						break;
					case 35:
						areaname = '전라북도';
						break;
					case 36:
						areaname = '전라남도';
						break;
					case 37:
						areaname = '경상북도';
						break;
					case 38:
						areaname = '경상남도';
						break;
					case 39:
						areaname = '제주특별자치도';
						break;
					default:
						areaname = '알 수 없는 지역';
						break;
				}

				html += '<tr>';
				html += '<td>' + title + '</td>';
				html += '<td>' + addr1 + '</td>';
				html +=
					'<td><img style="width: 200px;height: 200px;" src="' +
					firstimage +
					'"></td>';
				html += '</tr>';
			}
			responseContainer.innerHTML = html;

			var totalCount = parseInt(data.response.body.totalCount);
			var totalPages = Math.ceil(totalCount / 10); // 한 페이지에 10개씩 표시하도록 가정
			renderPagination(totalPages, page, keyword, contentTypeId, areaCode);
		}
	};
	xhr.send();
}

// 페이지 로드시 performSearch 함수 호출

function renderPagination(
	totalPages,
	currentPage,
	keyword,
	contentTypeId,
	areaCode,
) {
	var html = '<nav aria-label="Page navigation example">';
	html += '<ul class="pagination">';
	html += '<li class="page-item">';
	html += '<a class="page-link" href="#" aria-label="Previous">';
	html += '<span aria-hidden="true">&laquo;</span>';
	html += '</a>';
	html += '</li>';

	for (var i = 1; i <= totalPages; i++) {
		if (i === currentPage) {
			html +=
				'<li class="page-item active"><span class="page-link">' +
				i +
				'</span></li>';
		} else {
			html +=
				'<li class="page-item"><a class="page-link" href="#" data-page="' +
				i +
				'">' +
				i +
				'</a></li>';
		}
	}

	html += '<li class="page-item">';
	html += '<a class="page-link" href="#" aria-label="Next">';
	html += '<span aria-hidden="true">&raquo;</span>';
	html += '</a>';
	html += '</li>';
	html += '</ul>';
	html += '</nav>';

	// 생성된 HTML을 해당 위치에 추가 또는 대체하면 됩니다.
	// 예를 들어, id가 "paginationContainer"인 요소에 추가한다고 가정하면:
	document.getElementById('paginationContainer').innerHTML = html;

	// 페이지 링크 클릭 이벤트 핸들러 등록
	var pageLinks = paginationContainer.querySelectorAll('a');
	pageLinks.forEach(function (link) {
		link.addEventListener('click', function (event) {
			event.preventDefault();
			var selectedPage = parseInt(link.getAttribute('data-page'));
			performSearch(keyword, selectedPage, contentTypeId, areaCode);
		});
	});
}
