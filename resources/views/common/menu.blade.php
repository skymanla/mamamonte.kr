<div class="top-menu">
    <ul class="insu-type-menu">
        <li @if($tabRequest === 'studentList') class="active" @endif><a href="{{ route('student.list') }}">학생목록</a></li>
        <li @if($tabRequest === 'consultingList') class="active" @endif><a href="{{ route('consulting.list') }}">상담기록지</a></li>
        <li @if($tabRequest === 'experienceList') class="active" @endif>체험내용기록</li>
    </ul>
</div>
