var Calendar = function() {


    return {
        //main function to initiate the module
        init: function() {
            Calendar.initCalendar();
        },

        initCalendar: function() {

            if (!jQuery().fullCalendar) {
                return;
            }
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if (Metronic.isRTL()) {
                if ($('#calendar-data').parents(".portlet").width() <= 720) {
                    $('#calendar-data').addClass("mobile");
                    h = {
                        left: '',
                        center: 'prev title next',
                        right: ''
                    };
                } else {
                    $('#calendar-data').removeClass("mobile");
                    h = {
                        left: '',
                        center: 'prev title next',
                        right: ''
                    };
                }
            } else {
                if ($('#calendar-data').parents(".portlet").width() <= 720) {
                    $('#calendar-data').addClass("mobile");
                    h = {
                        left: '',
                        center: 'prev title next',
                        right: ''
                    };
                } else {
                    $('#calendar-data').removeClass("mobile");
                    h = {
                        left: '',
                        center: 'prev title next',
                        right: ''
                    };
                }
            }

            var initDrag = function(el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };

            var addEvent = function(title) {
                title = title.length === 0 ? "Untitled Event" : title;
                var html = $('<div class="external-event label label-default">' + title + '</div>');
                jQuery('#event_box').append(html);
                //initDrag(html);
            };

            $('#external-events div.external-event').each(function() {
                //initDrag($(this));
            });

            $('#event_add').unbind('click').click(function() {
                var title = $('#event_title').val();
                addEvent(title);
            });

            //predefined events
            $('#event_box').html("");

            $('#calendar-data').fullCalendar('destroy'); // destroy the calendar
            $('#calendar-data').fullCalendar(
            { //re-initialize the calendar
                header: h,
                //defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/
                droppable: true, // this allows things to be dropped onto the calendar !!!
                drop: function(date, allDay) { // this function is called when something is dropped
                    var originalEventObject = $(this).data('eventObject');
                    var copiedEventObject = $.extend({}, originalEventObject);
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");
                    $('#calendar-data').fullCalendar('renderEvent', copiedEventObject, true);
                    if ($('#drop-remove').is(':checked')) {
                        $(this).remove();
                    }
                },
                /*events: SITE_URL+"load-all-followup",
                eventRender: function(event, element) {
                    element.find('span.fc-title').html(element.find('span.fc-title').text());					  
                },*/
                timeFormat: 'h:mm A'
            });

        }

    };

}();
/* 
    [
                {
                    title: 'Monang Shah \n (Technical Round)',
                    start: '2015-07-02',
                    backgroundColor: Metronic.getBrandColor('yellow'),
                    url: 'http://google.com/',
                }, {
                    title: 'Long Event',
                    start: '2015-07-05',
                    backgroundColor: Metronic.getBrandColor('green'),
                    url: 'http://google.com/',
                }, {
                    title: 'Repeating Event',
                    start: new Date(y, m, d - 3, 16, 0),
                    backgroundColor: Metronic.getBrandColor('red'),
                    url: 'http://google.com/'
                }, {
                    title: 'Repeating Event',
                    start: '2015-07-15',
                    backgroundColor: Metronic.getBrandColor('green'),
                    url: 'http://google.com/'
                }, {
                    title: 'Meeting',
                    start: '2015-07-15',
                    url: 'http://google.com/'
                }, {
                    title: 'Lunch',
                    start: '2015-07-25',
                    url: 'http://google.com/',
                    backgroundColor: Metronic.getBrandColor('grey')
                }, {
                    title: 'Birthday Party',
                    start: '2015-08-06',
                    url: 'http://google.com/',
                    backgroundColor: Metronic.getBrandColor('purple')
                }, {
                    title: 'Click for Google',
                    start: '2015-08-15',
                    backgroundColor: Metronic.getBrandColor('yellow'),
                    url: 'http://google.com/'
                }]
*/