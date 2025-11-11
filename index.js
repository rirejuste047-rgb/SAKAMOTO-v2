```js
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// Auth
const { state, saveState } = useSingleFileAuthState('./auth.json');

// Créer la session
const startBot = () => {
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  // Enregistre la session à chaque changement
  sock.ev.on('creds.update', saveState);

  // Message reçu
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const command = body.startsWith('!') ? body.trim().split(' ')[0].slice(1).toLowerCase() : null;
    const args = body.trim().split(' ').slice(1);

    // Commandes simples
    if (command === 'ping') {
