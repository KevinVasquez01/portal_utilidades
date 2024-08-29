// app.js
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger');
const { dbConnect } = require('./config/database');
const companiesRoutes = require('./routes/companiesRoutes');
const dataElementsRoutes = require('./routes/dataElementsRoutes');
const companiesSalesforceRoutes = require('./routes/companiesSalesforceRoutes');
const defaultTemplatesRoutes = require('./routes/defaultTemplatesRoutes');
const historyChangesSincoRoutes = require('./routes/historyChangesSincoRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const usersProfileRoutes = require('./routes/usersProfileRoutes');
const reportsHistoryRoutes = require('./routes/reportsHistoryRoutes');
const usersMovementsRoutes = require('./routes/usersMovementsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const { syncDatabase } = require('./models/index');


// Configura el servidor
const app = express();

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));

// Database connection
dbConnect().then(() => {
  syncDatabase();  // Sincroniza los modelos después de conectar la base de datos
});

// Configura Sequelize
//---database.js

// Prueba la conexión a la base de datos
//---database.js

// Routes
// Usamos las rutas definidas en companiesRoutes
app.use('/UtilidadesAPI/Companies', companiesRoutes);
// Extraemos los dataElements
app.use('/UtilidadesAPI/', dataElementsRoutes);
// Extraemos companiesSalesforceReported
app.use('/UtilidadesAPI/', companiesSalesforceRoutes);
// Extraer Default Templates
app.use('/UtilidadesAPI/', defaultTemplatesRoutes);
// Extraer HistoryChangesSinco
app.use('/UtilidadesAPI/HistoryChangesSinco', historyChangesSincoRoutes);
// Notificaciones
app.use('/UtilidadesAPI/Notifications', notificationsRoutes);
// Extraer Perfiles
app.use('/UtilidadesAPI/Profiles', usersProfileRoutes);
// Reports History
app.use('/UtilidadesAPI/ReportsHistory', reportsHistoryRoutes);
// Users Movements
app.use('/UtilidadesAPI/UsersMovements', usersMovementsRoutes);
// Transactions
app.use('/UtilidadesAPI/Transactions', transactionsRoutes);
// Audit
app.use('/UtilidadesAPI/Audit', auditRoutes);


// Configura Swagger
setupSwagger(app);

// Define una ruta de ejemplo
//---userRoutes.js con userController

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });

  
// Inicia el servidor
//---server.js

module.exports = app;