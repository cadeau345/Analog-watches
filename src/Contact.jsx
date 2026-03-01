function Contact() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6 text-center">
      
      <h1 className="text-4xl font-bold mb-10">
        Contact Us
      </h1>

      <div className="flex flex-col md:flex-row justify-center gap-10">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/analog_watches_store?igsh=MXRuMjdud3NqZXcxaQ%3D%3D"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center hover:scale-105 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
            alt="Instagram"
            className="w-16 h-16 mb-3"
          />
          <span className="font-semibold">Instagram</span>
        </a>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@analog_watches?_r=1&_t=ZS-94J81LUWoFU"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center hover:scale-105 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png"
            alt="TikTok"
            className="w-16 h-16 mb-3"
          />
          <span className="font-semibold">TikTok</span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/201104245479"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center hover:scale-105 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
            className="w-16 h-16 mb-3"
          />
          <span className="font-semibold">WhatsApp</span>
        </a>

      </div>
    </div>
  );
}

export default Contact;