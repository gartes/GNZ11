/*******************************************************************************************************************
 *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *------------------------------------------------------------------------------------------------------------------
 * @author Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 25.12.2020 22:22
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 ******************************************************************************************************************/
function _YoutubeApi (){
    /**
     * создать ссылки на превью для видео
     * @param url
     * @param size
     * @returns {string|string[]}
     */
    this.getThumb = function (url, size){
        'use strict';

        var video, results,
        yoHost = 'https://img.youtube.com/vi/' ;
        if (url === null) {
            return '';
        }
        // size    = (size === null) ? 'big' : size;
        results = url.match('[\\?&]v=([^&#]*)');
        video   = (results === null) ? url : results[1];

        return [
            yoHost + video + '/0.jpg?size=480*360',                 // 480 * 360 - тоже hqdefault.jpg
            yoHost + video + '/1.jpg?size=120*90',                  // 120 * 90 фрагмент
            yoHost + video + '/2.jpg?size=120*90',                  // 120 * 90 фрагмент
            yoHost + video + '/3.jpg?size=120*90',                  // 120 * 90 фрагмент
            yoHost + video + '/hqdefault.jpg?size=480*360',         // 480 * 360
            yoHost + video + '/mqdefault.jpg?size=320*180',         // 320 * 180
            yoHost + video + '/maxresdefault.jpg?size=1280*720',    // 1280 * 720
        ];

    };


}
window.YoutubeApi = new _YoutubeApi();