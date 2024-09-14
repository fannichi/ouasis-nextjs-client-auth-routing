"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supabase = void 0;

var _supabaseJs = require("@supabase/supabase-js");

var supabase = (0, _supabaseJs.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.supabase = supabase;