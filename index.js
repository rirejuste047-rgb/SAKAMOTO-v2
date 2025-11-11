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
    if (command === 'ping') {Parfait, ton code est bien structuré ! Tu veux sûrement le *compléter* ou le *corriger*. Voici la suite logique après `if (command === 'ping')` :

```js
      await sock.sendMessage(from, { text: '🏓 Pong !' });
    }

    if (command === 'echo') {
      if (!args.length) {
        await sock.sendMessage(from, { text: '❗ Donne-moi un texte à répéter.' });
      } else {
        await sock.sendMessage(from, { text: args.join(' ') });
      }
    }

    if (command === 'tagall') {
      const groupMetadata = await sock.groupMetadata(from).catch(() => null);
      if (!groupMetadata) return sock.sendMessage(from, { text: '❌ Commande réservée aux groupes.' });

      const mentions = groupMetadata.participants.map(p => p.id);
      const mentionText = mentions.map(id => `@id.split('@')[0]`).join(' ');

      await sock.sendMessage(from, 
        text: `📢 *TAGALL :*{mentionText}`,
        mentions: mentions
      });
    }
  });
```

---

✅ Commandes incluses :
- `!ping` → Répond “🏓 Pong !”
- `!echo salut` → Répète “salut”
- `!tagall` → Mentionne tout le groupe (si exécuté dans un groupe)

---

Tu veux que je t’aide à séparer les commandes dans des fichiers comme `commands/ping.js` pour une structure propre ?
