@extends('main')
@section('content')
    <div id="contents">

    </div>
@endsection

@section('subscript')
    <script>
        $(document).ready(function () {
            miDesignPop.alert({
                dCopy: "{!! $message !!}",
                dYesAc: function () {// .yes-bt-ac 콜백
                    location.href = '/';
                }
            });
        });
    </script>
@endsection
