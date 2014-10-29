
Principles
================

* Content type names will be of the form `application/vnd.ozp-TYPENAME-VERSION+json`
* TYPENAME will be a '-' separated name
* Content types only applicable to one component of the Ozone Platform should be prefixed with that component.
* VERSION is of the form '-vN'.  Versions are only incremented on breaking changes to the format (i.e. adding/removing required fields).
* Examples:
    * application/vnd.ozp-application-v1+json
    * application/vnd.ozp-iwc-intent-registration-v1+json

HAL JSON
========
* Prefer [standard relations](http://www.iana.org/assignments/link-relations/link-relations.xhtml) when possible.
* The curie for OZP: `{ "name": "ozp", "href": "http://ozoneplatform.org/docs/rels/{rel}", "templated": true }` (TENTATIVE).
    *  All entities MUST have a "self" relation.
    *  All IWC entities MUST have a "ozp:iwcSelf" that is an OZP IWC URI.  This link refers to where the entity lives on the IWC bus.
* Servers will return all data with HAL JSON links and embedding, as appropriate.
* Servers will ignore any HAL JSON markup in content they receive from a client.

OZP IWC URIs
=============
Format: `web+ozp://<api>/<key> [? <query> ] [ # <subkey> ]`

* `api` - the api being addressed (e.g. "data.api", "intents.api")
* `key` - the key of the resource being addressed (e.g. "/webtop/123")
* `query` - non-hierarchical data separated by "&".  Fields begining with "ozp.*" are reserved for packet parameters.
* `subkey` - an address within the designated resource (e.g. JSON path, XPATH expression).

For internal use (e.g. the ozp:iwcSelf relation), the protocol "web+ozp://" may be implied.

TBD: resolution when the user clicks a link.



