"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCabin = getCabin;
exports.getCabinPrice = getCabinPrice;
exports.getGuest = getGuest;
exports.getBooking = getBooking;
exports.getBookings = getBookings;
exports.getBookedDatesByCabinId = getBookedDatesByCabinId;
exports.getSettings = getSettings;
exports.getCountries = getCountries;
exports.createGuest = createGuest;
exports.createBooking = createBooking;
exports.updateGuest = updateGuest;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
exports.getCabins = void 0;

var _dateFns = require("date-fns");

var _supabase = require("./supabase");

var _navigation = require("next/navigation");

/////////////
// GET
function getCabin(id) {
  var _ref, data, error;

  return regeneratorRuntime.async(function getCabin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('cabins').select('*').eq('id', id).single());

        case 2:
          _ref = _context.sent;
          data = _ref.data;
          error = _ref.error;

          // For testing
          // await new Promise((res) => setTimeout(res, 1000));
          if (error) {
            console.error(error);
            (0, _navigation.notFound)();
          }

          return _context.abrupt("return", data);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getCabinPrice(id) {
  var _ref2, data, error;

  return regeneratorRuntime.async(function getCabinPrice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('cabins').select('regularPrice, discount').eq('id', id).single());

        case 2:
          _ref2 = _context2.sent;
          data = _ref2.data;
          error = _ref2.error;

          if (error) {
            console.error(error);
          }

          return _context2.abrupt("return", data);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var getCabins = function getCabins() {
  var _ref3, data, error;

  return regeneratorRuntime.async(function getCabins$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('cabins').select('id, name, maxCapacity, regularPrice, discount, image').order('name'));

        case 2:
          _ref3 = _context3.sent;
          data = _ref3.data;
          error = _ref3.error;

          if (!error) {
            _context3.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Cabins could not be loaded');

        case 8:
          return _context3.abrupt("return", data);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Guests are uniquely identified by their email address


exports.getCabins = getCabins;

function getGuest(email) {
  var _ref4, data, error;

  return regeneratorRuntime.async(function getGuest$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('guests').select('*').eq('email', email).single());

        case 2:
          _ref4 = _context4.sent;
          data = _ref4.data;
          error = _ref4.error;
          return _context4.abrupt("return", data);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function getBooking(id) {
  var _ref5, data, error, count;

  return regeneratorRuntime.async(function getBooking$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings').select('*').eq('id', id).single());

        case 2:
          _ref5 = _context5.sent;
          data = _ref5.data;
          error = _ref5.error;
          count = _ref5.count;

          if (!error) {
            _context5.next = 9;
            break;
          }

          console.error(error);
          throw new Error('Booking could not get loaded');

        case 9:
          return _context5.abrupt("return", data);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function getBookings(guestId) {
  var _ref6, data, error, count;

  return regeneratorRuntime.async(function getBookings$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings') // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
          .select('id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)').eq('guestId', guestId).order('startDate'));

        case 2:
          _ref6 = _context6.sent;
          data = _ref6.data;
          error = _ref6.error;
          count = _ref6.count;

          if (!error) {
            _context6.next = 9;
            break;
          }

          console.error(error);
          throw new Error('Bookings could not get loaded');

        case 9:
          return _context6.abrupt("return", data);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getBookedDatesByCabinId(cabinId) {
  var today, _ref7, data, error, bookedDates;

  return regeneratorRuntime.async(function getBookedDatesByCabinId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          today = today.toISOString(); // Getting all bookings

          _context7.next = 5;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings').select('*').eq('cabinId', cabinId).or("startDate.gte.".concat(today, ",status.eq.checked-in")));

        case 5:
          _ref7 = _context7.sent;
          data = _ref7.data;
          error = _ref7.error;

          if (!error) {
            _context7.next = 11;
            break;
          }

          console.error(error);
          throw new Error('Bookings could not get loaded');

        case 11:
          // Converting to actual dates to be displayed in the date picker
          bookedDates = data.map(function (booking) {
            return (0, _dateFns.eachDayOfInterval)({
              start: new Date(booking.startDate),
              end: new Date(booking.endDate)
            });
          }).flat();
          return _context7.abrupt("return", bookedDates);

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function getSettings() {
  var _ref8, data, error;

  return regeneratorRuntime.async(function getSettings$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('settings').select('*').single());

        case 2:
          _ref8 = _context8.sent;
          data = _ref8.data;
          error = _ref8.error;

          if (!error) {
            _context8.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Settings could not be loaded');

        case 8:
          return _context8.abrupt("return", data);

        case 9:
        case "end":
          return _context8.stop();
      }
    }
  });
}

function getCountries() {
  var res, countries;
  return regeneratorRuntime.async(function getCountries$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(fetch('https://restcountries.com/v2/all?fields=name,flag'));

        case 3:
          res = _context9.sent;
          _context9.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          countries = _context9.sent;
          return _context9.abrupt("return", countries);

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          throw new Error('Could not fetch countries');

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
} /////////////
// CREATE


function createGuest(newGuest) {
  var _ref9, data, error;

  return regeneratorRuntime.async(function createGuest$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('guests').insert([newGuest]));

        case 2:
          _ref9 = _context10.sent;
          data = _ref9.data;
          error = _ref9.error;

          if (!error) {
            _context10.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Guest could not be created');

        case 8:
          return _context10.abrupt("return", data);

        case 9:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function createBooking(newBooking) {
  var _ref10, data, error;

  return regeneratorRuntime.async(function createBooking$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings').insert([newBooking]) // So that the newly created object gets returned!
          .select().single());

        case 2:
          _ref10 = _context11.sent;
          data = _ref10.data;
          error = _ref10.error;

          if (!error) {
            _context11.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Booking could not be created');

        case 8:
          return _context11.abrupt("return", data);

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  });
} /////////////
// UPDATE
// The updatedFields is an object which should ONLY contain the updated data


function updateGuest(id, updatedFields) {
  var _ref11, data, error;

  return regeneratorRuntime.async(function updateGuest$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('guests').update(updatedFields).eq('id', id).select().single());

        case 2:
          _ref11 = _context12.sent;
          data = _ref11.data;
          error = _ref11.error;

          if (!error) {
            _context12.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Guest could not be updated');

        case 8:
          return _context12.abrupt("return", data);

        case 9:
        case "end":
          return _context12.stop();
      }
    }
  });
}

function updateBooking(id, updatedFields) {
  var _ref12, data, error;

  return regeneratorRuntime.async(function updateBooking$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings').update(updatedFields).eq('id', id).select().single());

        case 2:
          _ref12 = _context13.sent;
          data = _ref12.data;
          error = _ref12.error;

          if (!error) {
            _context13.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Booking could not be updated');

        case 8:
          return _context13.abrupt("return", data);

        case 9:
        case "end":
          return _context13.stop();
      }
    }
  });
} /////////////
// DELETE


function deleteBooking(id) {
  var _ref13, data, error;

  return regeneratorRuntime.async(function deleteBooking$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(_supabase.supabase.from('bookings')["delete"]().eq('id', id));

        case 2:
          _ref13 = _context14.sent;
          data = _ref13.data;
          error = _ref13.error;

          if (!error) {
            _context14.next = 8;
            break;
          }

          console.error(error);
          throw new Error('Booking could not be deleted');

        case 8:
          return _context14.abrupt("return", data);

        case 9:
        case "end":
          return _context14.stop();
      }
    }
  });
}