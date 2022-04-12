/**
 * 
 */
 
var replyList = function() {
	
	$.ajax({
		url : '',
		type : '',
		data : { },
		success : function(res){
			rcode = "";
		
			rcode += '		<div class="card-body rcode">';
			rcode += '			<p class="p1">';
			rcode += '				작성자 : ' + v.writer + '';
			rcode += '				이메일 : ' + v.mail + '';
			rcode += '				날짜 : ' + v.wdate + '';
			rcode += '				조회수 : ' + v.hit + '';
			rcode += '			</p>';
			rcode += '			<p class="p2">';
			rcode += '				<input idx="' + v.num + '" type="button" class="action" name="modify" value="수정">';
			rcode += '				<input idx="' + v.num + '" type="button" class="action" name="delete" value="삭제">';
			rcode += '			</p>';
			rcode += '			<hr>';
			rcode += '			<p class="p3">';
			rcode += v.content;
			rcode += '			</p>';
			rcode += '		</div>';
			
		},
		error : function(xhr){
			alert("상태 : " + xhr.status);
		},
		dataType : 'json'
	})

}

var replyInsert = function(){
	$.ajax({
		url : '/board/ReplyInsert.do',
		type : 'post',
		data : reply, // reply객체 - bonum, name, cont
		success : function(res){
			alert(res.sw);
			// 댓글 출력
			replyList();
			
			
		},
		error : function(xhr){
			alert("상태 : " + xhr.status);
		},
		dataType : 'json'
	})
} 
 
 
var boardDelete = function() {
	typevalue = $('#stype option:selected').val().trim();
	wordvalue = $('#sword').val().trim();

	$.ajax({
		url : '/board/BoardDelete.do',
		type : 'post',
		data : {
			"page" : currentPage,
			"num" : actionIdx,
			"type" : typevalue,
			"word" : wordvalue
		},
		success : function(res){
			if(res.sw == "ok"){
				if(res.totalp < currentPage){
					currentPage = res.totalp;
				}
				listServer();
			}else{
				alert("삭제 실패");
			}
			
		},
		error : function(xhr){
			alert("상태 : " + xhr.status);//
		},
		dataType : 'json'
	})
}
 

var listServer = function() {
	$.ajax({
		url: '/board/List.do',
		// controller에서 타입을 service로 지정했기 때문에 get, post 상관 없음
		type: 'post', // 가져갈 데이터가 3개이기 때문에 post로 지정
		data: {
			'page': currentPage,
			'stype': typevalue, // writer, content
			'sword': wordvalue
		},
		success: function(res) {
			// code를 container에 출력
			code = '<div id="accordion">';

			$.each(res.datas, function(i, v) {
				code += '<div class="card">';
				code += '	<div class="card-header">';
				code += '		<a class="card-link" data-toggle="collapse" href="#collapse' + v.num + '">';
				code += v.subject + '</a>';
				code += '	</div>';
				code += '	<div id="collapse' + v.num + '" class="collapse" data-parent="#accordion">';
				code += '		<div class="card-body">';
				code += '			<p class="p1">';
				code += '				작성자 : ' + v.writer + '';
				code += '				이메일 : ' + v.mail + '';
				code += '				날짜 : ' + v.wdate + '';
				code += '				조회수 : ' + v.hit + '';
				code += '			</p>';
				code += '			<p class="p2">';
				code += '				<input idx="' + v.num + '" type="button" class="action" name="modify" value="수정">';
				code += '				<input idx="' + v.num + '" type="button" class="action" name="delete" value="삭제">';
				code += '			</p>';
				code += '			<hr>';
				code += '			<p class="p3">';
				code += v.content;
				code += '			</p>';
				code += '			<p class="p4">';
				code += '				<textarea rows="" cols="80"></textarea>';
				code += '				<input idx="' + v.num + '" type="button" class="action" name="reply" value="등록">';
				code += '			</p>';
				code += '		</div>';
				code += '	</div>';
				code += '</div>';
			}) // 반복문

			$('.container').html(code);

            
            code += '</div>';
            
            $('.container').html(code);
            
            // 이전버튼 출력
            pcode = "";
            
            if(res.startp > 1){
               pcode = '<ul class="pagination">';
                 pcode += '<li class="page-item">';
                 pcode += '<a class="page-link prev" href="#">Previous</a>';
                 pcode += '</li></ul>';
            }
            
            // 페이지목록 출력
            pcode += '<ul class="pagination pager">';
            
            for(i = res.startp; i <= res.endp; i++){
               
               if(currentPage == i){
                  pcode += '<li class="page-item active">';
                  pcode += '<a class="page-link pnum" href="#">' + i + '</a></li>';
               }else{
                  pcode += '<li class="page-item">';
                  pcode += '<a class="page-link pnum" href="#">' + i + '</a></li>';
               }
            }
            pcode += '</ul>';
            
            // 다음버튼 출력
            if(res.endp < res.totalp){
               pcode += '<ul class="pagination">';
                 pcode += '<li class="page-item">';
                 pcode += '<a class="page-link next" href="#">Next</a>';
                 pcode += '</li></ul>';
            }
            
			$('#pagelist').html(pcode);

		},   // seccess 끝
		error: function(xhr) {
			alert("상태 : " + xhr.status)
		},
		dataType: 'json'

	})   // ajax 종료
}