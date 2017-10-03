const { Event, Messages } = require('../models/events');
module.exports = {
	getResource: async function(_id, method, options, populate) {
		if (!_id) {
			throw new Error('No id supplied for resource method.');
		}
		let resource;
		if (populate) {
			resource = await method(_id, options).populate(populate);
		} else {
			resource = await method(_id, options);
		}
		if (!resource) {
			throw new Error('No resource found with that id.');
		}
		return resource;
	},

	createResponse: data => {
		const isError = data instanceof Error;
		const response = {
			success: isError ? false : true
		};
		if (isError) {
			response.apiError = data.message;
		} else {
			response.apiData = data;
		}
		return response;
	},
	log: event => {
		event.save();
		console.log(event);
	},
	logEvent: (type, options, internal) => {
		const newEvent = new type(
			Object.assign(
				{
					internal
				},
				options
			)
		);
		module.exports.log(newEvent);
		return newEvent;
	},
	logError: error => {
		console.log(error);
		const newEvent = new Event({
			message: Messages.INTERNAL_ERROR,
			owner: {
				message: error.message
			}
		});
		module.exports.log(newEvent);
		return newEvent;
	}
};
