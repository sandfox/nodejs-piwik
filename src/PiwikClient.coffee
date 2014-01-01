urltool = require 'url'
querystring = require 'querystring'

class PiwikClient

	constructor : (baseURL, token)->
		url = urltool.parse baseURL, true

		@settings = {}

		#protocol and port
		switch url.protocol
			when 'http:'
				@http = require 'http'
				@settings.apiport ? url.port or 80

			when 'https:'
				@http = require 'https'
				@settings.apiport ? url.port or 443


		#token in baseURL?
		if url.query and url.query.token_auth
			@settings.token = url.query.token_auth


		#override with custom token, if any
		if token
			@settings.token = token

		#the rest
		@settings.apihost = url.hostname
		@settings.apipath = url.pathname

	#API call
	api : (vars, cb)->

		#prepare fields
		if typeof vars isnt 'object' then vars = {}
		vars.module = 'API'
		vars.format = 'JSON'
		#Allow token to over-ridden per request
		vars.token_auth ?= @settings.token

		#do request
		@http.get
			host:	@settings.apihost
			port:	@settings.apiport
			path:	@settings.apipath + '?' + querystring.stringify vars
			(response)->

				data = ''
				response.on 'data', (chunk)-> data += chunk
				response.on 'end', ()->

					#callback
					try
						resObj = JSON.parse data
						if resObj.result is 'error'
							return cb resObj.message, null
							
						cb null, resObj
					catch error
						cb error.message, null

#ready
module.exports = PiwikClient
