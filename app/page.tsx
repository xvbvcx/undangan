import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateGrid } from "@/components/TemplateGrid";
import { templates } from "@/lib/templates";
import { formatRupiah } from "@/lib/format";

export default function HomePage() {
  const premiumPrice = Number(process.env.PREMIUM_PRICE || 299000);
  return (
    <main>
      <SiteHeader />
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Nikah Kilat</span>
          <h1>Website undangan pernikahan online yang cepat, modern, dan terlihat mahal.</h1>
          <p>20 template gratis tetap profesional. 20 template premium dibuat ultra exclusive dengan visual cinematic, no watermark, dan alur pembayaran otomatis via iPaymu.</p>
          <div className="hero-actions">
            <Link href="#template" className="button gold">Lihat 40 template</Link>
            <Link href="/register" className="button ghost">Mulai buat undangan</Link>
          </div>
          <div className="stat-row">
            <div><strong>40</strong><span>template</span></div>
            <div><strong>8</strong><span>foto maksimal</span></div>
            <div><strong>30 hari</strong><span>masa aktif</span></div>
          </div>
        </div>
        <div className="hero-showcase">
          <div className="luxury-phone floating-a"><span>Premium</span><h2>A & R</h2><p>Ultra Exclusive</p></div>
          <div className="luxury-phone small floating-b"><span>Gratis</span><h2>N & D</h2><p>Profesional</p></div>
          <div className="gold-ring" />
        </div>
      </section>

      <section className="section difference-section">
        <div className="section-head">
          <span className="eyebrow">Perbedaan signifikan</span>
          <h2>Standar tetap bagus. Premium harus bikin user mikir, “ini beda kelas”.</h2>
        </div>
        <div className="comparison-grid">
          <div className="plan-card free-plan">
            <span className="badge badge-free">Gratis</span>
            <h3>Standar Profesional</h3>
            <p>Template cantik, mobile, RSVP, countdown, galeri, backsound, dan animasi loading.</p>
            <ul><li>20 template standar</li><li>Watermark Nikah Kilat</li><li>Galeri maksimal 8 foto</li><li>Masa aktif 30 hari</li></ul>
          </div>
          <div className="plan-card premium-plan" id="harga">
            <span className="badge badge-premium">Premium Ultra Exclusive</span>
            <h3>{formatRupiah(premiumPrice)}</h3>
            <p>Visual lebih mewah, parallax cinematic, no watermark, prioritas desain, dan opsi custom manual via admin.</p>
            <ul><li>20 template premium ultra</li><li>No watermark</li><li>Animasi lebih cinematic</li><li>Unlock otomatis iPaymu</li><li>Custom manual via WhatsApp admin</li></ul>
          </div>
        </div>
      </section>

      <TemplateGrid templates={templates} />

      <section className="section cta-section">
        <div>
          <span className="eyebrow">Siap publish</span>
          <h2>Buat undangan, upload foto, bayar kalau premium, lalu share link.</h2>
          <p>User bisa edit undangan kapan saja dari dashboard selama masa aktif.</p>
        </div>
        <Link href="/register" className="button gold">Daftar sekarang</Link>
      </section>
    </main>
  );
}
