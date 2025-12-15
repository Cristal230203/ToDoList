const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

// Registro
router.post('/register', async (req, res) => {
  try {
    console.log('=== DEBUG REGISTRO ===');
    console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
    console.log('📦 Content-Type:', req.headers['content-type']);
    
    const { username, email, password } = req.body;
    
    console.log('📦 Username:', username);
    console.log('📦 Email:', email);
    console.log('📦 Password length:', password ? password.length : 0);

    // Validación mejorada
    if (!username || username.trim() === '' || 
        !email || email.trim() === '' || 
        !password || password.trim() === '') {
      console.log('❌ VALIDACIÓN FALLIDA');
      console.log('   - username válido:', !!username && username.trim() !== '');
      console.log('   - email válido:', !!email && email.trim() !== '');
      console.log('   - password válido:', !!password && password.trim() !== '');
      
      return res.status(400).json({ 
        error: 'Por favor proporciona nombre, email y contraseña'
      });
    }

    console.log('✅ Validación pasada, buscando usuario existente...');

    // Validar que el usuario no exista
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      console.log('❌ Email ya registrado');
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    console.log('✅ Email disponible, creando usuario...');

    // Crear usuario
    const user = new User({ 
      username: username.trim(), 
      email: email.trim().toLowerCase(), 
      password: password.trim()
    });
    
    await user.save();

    console.log('✅ Usuario creado exitosamente:', user.username);

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generado');

    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log('=== FIN DEBUG REGISTRO ===\n');

  } catch (error) {
    console.error('❌ ERROR EN REGISTRO:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al registrar usuario', 
      details: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('=== DEBUG LOGIN ===');
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;

    if (!email || email.trim() === '' || 
        !password || password.trim() === '') {
      console.log('❌ Validación login fallida');
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    console.log('✅ Buscando usuario...');

    // Buscar usuario
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Usuario encontrado, verificando password...');

    // Verificar password
    const isMatch = await user.comparePassword(password.trim());
    if (!isMatch) {
      console.log('❌ Password incorrecto');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso:', user.username);

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log('=== FIN DEBUG LOGIN ===\n');

  } catch (error) {
    console.error('❌ ERROR EN LOGIN:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión', 
      details: error.message 
    });
  }
});

module.exports = router;