// JSONArray results_annexe4 = new JSONArray();
// LogMessage(Level.INFO, "Executing Request__annexe4 :"+annexe4_sql);
// ResultSet rs_annexe4 = pre.executeQuery(annexe4_sql);
// LogMessage(Level.INFO, " query _annexe4 executed ");
// rs_annexe4.last();
// int numberofrows_annexe4 = rs_annexe4.getRow();
// rs_annexe4.beforeFirst();
// ResultSetMetaData metadata_annexe4 = rs_annexe4.getMetaData();
// int columnCount_annexe4 = metadata_annexe4.getColumnCount();
// LogMessage(Level.INFO, "Request result columnCount_annexe4 <> " + columnCount_annexe4);
// LogMessage(Level.INFO, "Request result numberofrows_annexe4 <> " + numberofrows_annexe4);

// while (rs_annexe4.next()) {
//   JSONObject object_annexe4 = new JSONObject();
//   for (int i = 1; i <= columnCount_annexe4; i++) {
//       object_annexe4.put(metadata_annexe4.getColumnName(i), rs_annexe4.getString(i));
//   }
//   results_annexe4.put(object_annexe4);
// }