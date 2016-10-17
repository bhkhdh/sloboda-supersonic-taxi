#
ActiveRecord::Schema.define(version: 20161011133401) do
  enable_extension 'plpgsql"'

  create_table "admins", force: :cascade do |t|
    t.string   "login",               default: "", null: false
    t.string   "encrypted_password",  default: "", null: false
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",       default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "active"
    t.index ["login"], name: "index_admins_on_login", unique: true, using: :btree
  end

  create_table "dispatchers", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.boolean  "active"
    t.index ["email"], name: "index_dispatchers_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_dispatchers_on_reset_password_token", unique: true, using: :btree
  end

  create_table "drivers", force: :cascade do |t|
    t.string   "car_type"
    t.integer  "passengers"
    t.integer  "trunk"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "phone",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.boolean  "active"
    t.string   "name"
    t.index ["phone"], name: "index_drivers_on_phone", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_drivers_on_reset_password_token", unique: true, using: :btree
  end

  create_table "orders", force: :cascade do |t|
    t.string   "phone"
    t.string   "start_point"
    t.string   "end_point"
    t.text     "comment"
    t.integer  "client_id"
    t.integer  "driver_id"
    t.integer  "dispatcher_id"
    t.integer  "passengers"
    t.boolean  "baggage"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "email"
  end

  create_table "orders_blogs", force: :cascade do |t|
    t.string   "action"
    t.integer  "order_id"
    t.integer  "dispatcher_id"
    t.integer  "driver_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

end
