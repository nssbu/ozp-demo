'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ozpDemoIncidentList')
.value('incidentData', [
    {
        'title': "Low disk space on 192.168.1.101",
        'incidentType': "SERVER_MONITOR_LOW_DISK",
        'description' : "Disk space dropped below 10% available at Thu Aug 14 2014 12:00:00 GMT-0400",
        'occurredAt': "Thu Aug 14 2014 12:00:00 GMT-0400",
        'severity' : "warning",
        'associatedResources': [
            {
                'contentType': "application/server+json",
                'entity': {
                    'ip' : '192.168.1.101'
                }
            },{
                'contentType': "application/metric+json",
                'entity': {
                    'url': "http://metrics.example.com/123456"
                }
            }
        ]
    },{
        'title': "Melissa worm detected on 192.168.100.30",
        'incidentType': "VIRUS",
        'occurredAt': "Thu Aug 14 2014 11:00:00 GMT-0400",
        'severity' : "danger",
        'description' : "Network traffic analysis indicates that a worm may be running on a 192.168.100.30",
        'associatedResources': [
            {
                'contentType': "application/workstation+json",
                'entity': {
                    'ip' : '192.168.100.30'
                }
            },{
                'contentType': "application/virus+json",
                'entity': {
                    'id': "W97M.Melissa.A"
                }
            }
        ]
    },{
        'title': "IP address 192.168.100.67 has been visiting inappropriate sites.",
        'incidentType': "CONTENT_CONTROL_VIOLATION",
        'occurredAt': "Thu Aug 14 2014 10:55:00 GMT-0400",
        'severity' : "info",
        'description': "The workstation 192.168.100.67 has been visiting Monster.com in violation of company policy.",
        'associatedResources': [
            {
                'contentType': "application/workstation+json",
                'entity': {
                    'ip' : '192.168.100.67'
                }
            },{
                'contentType': "application/filter-violations+json",
                'entity': {
                    'violationType': "Restricted site",
                    'site': "http://www.monster.com",
                    'reason': "Employees are not allowed to leave."
                }
            }
        ]
    }
]);
