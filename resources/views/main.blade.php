<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,,height=device-height,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="robots" content="noindex, nofollow"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>마마몽떼 - 센터관리자</title>

    <!-- STR favicon -->
    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.png') }}" />
    <!-- END favicon -->

    <!-- STR css link -->
    <link rel="stylesheet" href="{{ asset('js/util/jquery-ui-themes-1.12.1/themes/_mibank/jquery-ui.css') }}?v={{ time() }}" />
    <link rel="stylesheet" href="{{ asset('css/reset.css') }}?v={{ time() }}" />
    <link rel="stylesheet" href="{{ asset('css/three-dots.css') }}?v={{ time() }}" />
    <link rel="stylesheet" href="{{ asset('css/common.css') }}?v={{ time() }}" />
    <link rel="stylesheet" href="{{ asset('js/util/popup/v1.1/css/mi.design.pop.css') }}?v={{ time() }}" />
    @yield('subcss')
    <!-- END css link -->

    <!-- STR script link -->
    <script src="{{ asset('js/util/jquery/jquery-3.4.1.min.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/util/jquery-ui-themes-1.12.1/jquery-ui.js') }}?v={{ time() }}"></script>
    <script src="{{ asset('js/util/popup/v1.1/js/mi.design.pop.js') }}?v={{ time() }}"></script>
    <!-- END script link -->

</head>
<body>
    @include('common.nav')
    @yield('content')
    <!-- STR script link -->
    <script src="{{ asset('js/common.js') }}?v={{ time() }}"></script>
    @yield('subscript')
    {{--<script src="{{ asset('js/view.sign.js') }}?v={{ time() }}"></script>--}}
    <!-- END script link -->
</body>
</html>

