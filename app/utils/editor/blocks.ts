import type { Editor } from 'grapesjs'

export function registerBlocks(editor: Editor, t: (key: string) => string) {
  const bm = editor.BlockManager

  // ── 1. Text & Banner ──────────────────────────────────
  bm.add('text-banner', {
    label: t('blocks.textBanner'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.15"/>
      <rect x="4" y="8" width="32" height="18" rx="3" fill="#6c63ff" opacity="0.5"/>
      <rect x="4" y="29" width="20" height="3" rx="1.5" fill="#6c63ff"/>
      <rect x="4" y="34" width="14" height="2" rx="1" fill="#8892a4"/>
    </svg>`,
    content: `
      <section data-gjs-name="Banner Section" style="
        position: relative;
        width: 100%;
        height: 50vh;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: #1e1b4b;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <!-- Dedicated Background Image Container -->
        <div data-gjs-name="Banner Image" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        "></div>

        <!-- Background Overlay -->
        <div data-gjs-name="Banner Overlay" data-gjs-selectable="false" data-gjs-hoverable="false" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(49, 46, 129, 0.7) 50%, rgba(76, 29, 149, 0.7) 100%);
          pointer-events: none;
        "></div>

        <!-- Content Area -->
        <div data-gjs-name="Banner Content" data-gjs-droppable="true" style="
          position: relative; z-index: 3;
          text-align: center;
          padding: clamp(30px, 8vw, 60px) clamp(20px, 5vw, 40px);
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        ">
          <span data-gjs-name="Badge" style="
            display: inline-block;
            font-size: 11px; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: #a78bfa;
            background: rgba(167, 139, 250, 0.12);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 100px; padding: 4px 14px;
            margin-bottom: 20px;
          ">New Feature</span>

          <h1 data-gjs-name="Main Heading" style="
            font-size: clamp(1.8rem, 5vw, 3.5rem);
            font-weight: 800;
            line-height: 1.1;
            color: #ffffff;
            margin: 0 0 20px;
            letter-spacing: -0.03em;
          ">Banner Section Experience</h1>

          <p data-gjs-name="Subheading" style="
            font-size: clamp(15px, 2vw, 18px);
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.85);
            margin: 0 0 32px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          ">Create high-impact sections that capture attention immediately. Now with a more compact 50vh height for better visibility.</p>

          <div data-gjs-name="Button Group" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a data-gjs-name="Primary Button" href="#" style="
              display: inline-block;
              padding: 12px 28px;
              background: #ffffff;
              color: #1e1b4b; text-decoration: none;
              font-size: 14px; font-weight: 700;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              transition: transform 0.2s;
            ">Get Started →</a>
          </div>
        </div>
      </section>
    `
  })

  // ── 2. Multi Columns — 2 cols ──────────────────────────
  bm.add('multi-cols-2', {
    label: t('blocks.multiCols2'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#34d399" opacity="0.1"/>
      <rect x="4" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
      <rect x="22" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Two Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: clamp(14px, 2vw, 16px); margin: 0 0 48px;
        ">Edit this section to add your own content</p>

        <div style="
          display: flex;
          gap: clamp(16px, 3vw, 32px);
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 260px;
            padding: clamp(24px, 4vw, 36px);
            background: #f8f9fc;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          ">
            <div style="
              width: 48px; height: 48px; border-radius: 12px;
              background: linear-gradient(135deg, #6c63ff, #a78bfa);
              display: flex; align-items: center; justify-content: center;
              font-size: 22px; margin-bottom: 20px;
            ">✨</div>
            <h3 style="
              font-size: 1.2rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 12px;
            ">Feature One</h3>
            <p style="
              font-size: 15px; line-height: 1.7;
              color: #6b7280; margin: 0;
            ">Describe the first key feature or benefit here. Keep it concise and focused on the user's needs.</p>
          </div>

          <!-- Column 2 -->
          <div style="
            flex: 1; min-width: 280px;
            padding: 36px;
            background: #f8f9fc;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          ">
            <div style="
              width: 48px; height: 48px; border-radius: 12px;
              background: linear-gradient(135deg, #34d399, #059669);
              display: flex; align-items: center; justify-content: center;
              font-size: 22px; margin-bottom: 20px;
            ">🚀</div>
            <h3 style="
              font-size: 1.2rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 12px;
            ">Feature Two</h3>
            <p style="
              font-size: 15px; line-height: 1.7;
              color: #6b7280; margin: 0;
            ">Describe the second key feature or benefit here. Keep it concise and focused on the user's needs.</p>
          </div>
        </div>
      </section>
    `
  })

  // ── 3. Multi Columns — 3 cols ──────────────────────────
  bm.add('multi-cols-3', {
    label: t('blocks.multiCols3'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#fbbf24" opacity="0.1"/>
      <rect x="4" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="16" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="28" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: linear-gradient(180deg, #fafbff 0%, #f0f2f8 100%);
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Three Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: clamp(14px, 2vw, 16px); margin: 0 0 48px;
        ">Showcase your features, team, or services in three equal columns</p>

        <div style="
          display: flex;
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">🎯</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 10px;
            ">Precision</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: #6b7280; margin: 0;
            ">Built for accuracy and attention to detail in every component.</p>
          </div>

          <!-- Column 2 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: linear-gradient(135deg, #6c63ff, #7c3aed);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(108, 99, 255, 0.35);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">⚡</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: white; margin: 0 0 10px;
            ">Performance</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: rgba(255,255,255,0.8); margin: 0;
            ">Lightning-fast experience with optimized rendering.</p>
          </div>

          <!-- Column 3 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">🔒</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 10px;
            ">Security</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: #6b7280; margin: 0;
            ">Enterprise-grade security baked in from the ground up.</p>
          </div>
        </div>
      </section>
    `
  })

  // ── 4. Text Content ────────────────────────────────────
  bm.add('text-content', {
    label: t('blocks.textContent'),
    category: t('blocks.categories.basic'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.1"/>
      <rect x="6" y="10" width="28" height="4" rx="2" fill="#6c63ff" opacity="0.7"/>
      <rect x="6" y="18" width="24" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="24" width="26" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="30" width="20" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
    </svg>`,
    content: `
      <section style="
        width: 100%; padding: clamp(30px, 8vw, 60px) clamp(20px, 5vw, 40px);
        background: white;
        font-family: 'Inter', system-ui, sans-serif;
        max-width: 820px; margin: 0 auto;
      ">
        <h2 style="
          font-size: clamp(1.4rem, 4vw, 1.8rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 16px;
          letter-spacing: -0.01em;
        ">Your Title Goes Here</h2>
        <p style="
          font-size: clamp(14px, 2vw, 16px); line-height: 1.8;
          color: #4b5563; margin: 0 0 20px;
        ">This is a paragraph of text. Click to edit and type your content directly. You can also use the style panel on the right to customize fonts, colors, and spacing.</p>
      </section>
    `
  })

  // ── 5. Image & Text ────────────────────────────────────
  bm.add('image-text', {
    label: t('blocks.imageText'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#ec4899" opacity="0.1"/>
      <rect x="4" y="10" width="14" height="20" rx="2" fill="#ec4899" opacity="0.5"/>
      <rect x="22" y="12" width="14" height="2" rx="1" fill="#ec4899" opacity="0.8"/>
      <rect x="22" y="18" width="14" height="2" rx="1" fill="#8892a4" opacity="0.5"/>
      <rect x="22" y="24" width="10" height="2" rx="1" fill="#8892a4" opacity="0.5"/>
    </svg>`,
    content: `
      <section style="
        width: 100%; padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: clamp(24px, 5vw, 60px);
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Image Column -->
          <div style="flex: 1; min-width: 280px;">
            <div style="
              width: 100%; height: clamp(280px, 40vh, 400px);
              background: #f3f4f6;
              border-radius: 20px;
              overflow: hidden;
              display: flex; align-items: center; justify-content: center;
            ">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                   alt="Modern Workspace" 
                   style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          </div>

          <!-- Text Column -->
          <div style="flex: 1; min-width: 280px;">
            <div style="
              padding: 10px 0;
            ">
              <span style="
                display: inline-block;
                color: #ec4899;
                font-weight: 700;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 16px;
              ">Premium Design</span>
              
              <h2 style="
                font-size: clamp(1.6rem, 4vw, 2.5rem);
                font-weight: 800;
                color: #111827;
                line-height: 1.2;
                margin: 0 0 20px;
                letter-spacing: -0.02em;
              ">Elevate Your Visual Experience</h2>
              
              <p style="
                font-size: clamp(15px, 2vw, 18px);
                line-height: 1.7;
                color: #4b5563;
                margin-bottom: 28px;
              ">Create a lasting impression with our beautifully crafted sections. Our design philosophy focuses on clarity, elegance, and user engagement.</p>
              
              <ul style="list-style: none; padding: 0; margin-bottom: 28px;">
                <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-weight: 500; color: #374151; font-size: 14px;">
                  <span style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: rgba(236,72,153,0.1); color: #ec4899; border-radius: 50%; font-size: 12px;">✓</span>
                  Mobile Responsive Layouts
                </li>
              </ul>
              
              <a href="#" style="
                display: inline-block;
                padding: 10px 24px;
                background: #111827;
                color: white;
                text-decoration: none;
                font-weight: 600;
                border-radius: 10px;
                font-size: 14px;
              ">Explore More</a>
            </div>
          </div>
        </div>
      </section>
    `
  })

  // ── 6. Carousel Section (Testimonials) ──────────────────
  bm.add('carousel-section', {
    label: t('blocks.carouselSection'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6366f1" opacity="0.1"/>
      <rect x="4" y="14" width="10" height="12" rx="2" fill="#6366f1" opacity="0.4"/>
      <rect x="15" y="12" width="10" height="16" rx="2" fill="#6366f1" opacity="0.8"/>
      <rect x="26" y="14" width="10" height="12" rx="2" fill="#6366f1" opacity="0.4"/>
      <circle cx="15" cy="34" r="1.5" fill="#6366f1" opacity="0.3"/>
      <circle cx="20" cy="34" r="1.5" fill="#6366f1"/>
      <circle cx="25" cy="34" r="1.5" fill="#6366f1" opacity="0.3"/>
    </svg>`,
    content: `
      <section data-gjs-type="carousel-section" class="vueper-slider-section" style="
        width: 100%; padding: 100px 0;
        background: linear-gradient(135deg, #f8f9ff 0%, #f1f3fd 100%);
        font-family: 'Inter', system-ui, sans-serif;
        overflow: hidden;
      ">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 20px; text-align: center; margin-bottom: 60px;">
          <h2 style="
            font-size: clamp(2rem, 5vw, 3rem); font-weight: 900;
            color: #1e1b4b; margin: 0 0 16px;
            letter-spacing: -0.04em;
          ">Wall of Love</h2>
          <div style="width: 60px; height: 4px; background: #6366f1; margin: 0 auto 24px; border-radius: 2px;"></div>
          <p style="
            color: #636e81; font-size: clamp(16px, 2vw, 19px);
            max-width: 600px; margin: 0 auto; line-height: 1.6;
          ">Join thousands of satisfied users who have transformed their digital presence with our intuitive platform.</p>
        </div>

        <div class="vueper-viewport" style="
          position: relative;
          width: 100%;
          padding: 20px 0 60px;
          cursor: grab;
          user-select: none;
        ">
          <div class="vueper-track" style="
            display: flex;
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
            gap: 30px;
            padding: 0 15%;
          ">
            <!-- Testimonial 1 -->
            <div class="vueper-slide" style="
              flex: 0 0 400px;
              max-width: 80vw;
              transition: all 0.5s ease;
              opacity: 0.4;
              transform: scale(0.85);
            ">
              <div style="
                background: white;
                padding: 40px;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                border: 1px solid rgba(255,255,255,0.8);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              ">
                <div>
                  <div style="color: #fbbf24; font-size: 24px; margin-bottom: 20px;">★★★★★</div>
                  <p style="font-size: 18px; line-height: 1.7; color: #374151; font-style: italic; margin-bottom: 30px;">
                    "The editor is incredibly intuitive. I was able to build my professional landing page in less than an hour."
                  </p>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a78bfa); display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 18px;">SJ</div>
                  <div>
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #1e1b4b;">Sarah Jenkins</h4>
                    <p style="margin: 0; font-size: 14px; color: #8892a4;">Marketing Director</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Testimonial 2 -->
            <div class="vueper-slide active" style="
              flex: 0 0 400px;
              max-width: 80vw;
              transition: all 0.5s ease;
              opacity: 1;
              transform: scale(1);
            ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 24px;
                box-shadow: 0 30px 60px rgba(99, 102, 241, 0.15);
                border: 1px solid #eef2ff;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
              ">
                <div style="position: absolute; top: 20px; right: 30px; font-size: 60px; color: #6366f1; opacity: 0.1; font-family: serif;">"</div>
                <div>
                  <div style="color: #fbbf24; font-size: 24px; margin-bottom: 20px;">★★★★★</div>
                  <p style="font-size: 18px; line-height: 1.7; color: #374151; font-style: italic; margin-bottom: 30px;">
                    "Outstanding performance and flexibility. The pre-built blocks are beautifully designed and easy to customize."
                  </p>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #34d399, #059669); display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 18px;">MA</div>
                  <div>
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #1e1b4b;">Marcus Aurelio</h4>
                    <p style="margin: 0; font-size: 14px; color: #8892a4;">Startup Founder</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Testimonial 3 -->
            <div class="vueper-slide" style="
              flex: 0 0 400px;
              max-width: 80vw;
              transition: all 0.5s ease;
              opacity: 0.4;
              transform: scale(0.85);
            ">
              <div style="
                background: white;
                padding: 40px;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                border: 1px solid rgba(255,255,255,0.8);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              ">
                <div>
                  <div style="color: #fbbf24; font-size: 24px; margin-bottom: 20px;">★★★★★</div>
                  <p style="font-size: 18px; line-height: 1.7; color: #374151; font-style: italic; margin-bottom: 30px;">
                    "The best GrapesJS integration I've seen. Nuxt 4 makes it feel snappy and modern. Highly recommended."
                  </p>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f87171, #dc2626); display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 18px;">LW</div>
                  <div>
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #1e1b4b;">Laura White</h4>
                    <p style="margin: 0; font-size: 14px; color: #8892a4;">UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="vueper-arrows" style="position: absolute; top: 50%; left: 0; width: 100%; display: flex; justify-content: space-between; padding: 0 5%; pointer-events: none; transform: translateY(-50%);">
            <button class="vueper-arrow prev" style="width: 44px; height: 44px; border-radius: 50%; background: white; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center; color: #1e1b4b;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button class="vueper-arrow next" style="width: 44px; height: 44px; border-radius: 50%; background: white; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center; color: #1e1b4b;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          
          <div class="vueper-bullets" style="display: flex; justify-content: center; gap: 10px; margin-top: 40px;">
            <div class="bullet active" style="width: 30px; height: 6px; border-radius: 3px; background: #6366f1; cursor: pointer; transition: all 0.3s ease;"></div>
            <div class="bullet" style="width: 10px; height: 6px; border-radius: 3px; background: #cbd5e1; cursor: pointer; transition: all 0.3s ease;"></div>
            <div class="bullet" style="width: 10px; height: 6px; border-radius: 3px; background: #cbd5e1; cursor: pointer; transition: all 0.3s ease;"></div>
          </div>
        </div>
        
        <style>
          .vueper-viewport.grabbing { cursor: grabbing; }
          .vueper-slide.active { opacity: 1 !important; transform: scale(1) !important; }
          .vueper-slide.active div { box-shadow: 0 30px 60px rgba(99, 102, 241, 0.2) !important; }
          .vueper-arrow:hover { background: #6366f1 !important; color: white !important; transform: scale(1.1); transition: all 0.2s; }
          @media (max-width: 768px) {
            .vueper-track { padding: 0 5% !important; }
            .vueper-slide { flex: 0 0 300px !important; }
          }
        </style>

        <script>
          (function() {
            const container = document.querySelector('.vueper-slider-section');
            if (!container) return;
            const track = container.querySelector('.vueper-track');
            const slides = container.querySelectorAll('.vueper-slide');
            const bullets = container.querySelectorAll('.bullet');
            const nextBtn = container.querySelector('.vueper-arrow.next');
            const prevBtn = container.querySelector('.vueper-arrow.prev');
            const viewport = container.querySelector('.vueper-viewport');

            if (!track || !slides.length) return;

            let currentIndex = 1;
            let startPos = 0;
            let isDragging = false;
            let currentTranslate = 0;
            let prevTranslate = 0;

            function updateUI() {
              slides.forEach(function(s, i) {
                s.classList.toggle('active', i === currentIndex);
              });
              bullets.forEach(function(b, i) {
                const isActive = i === currentIndex;
                b.style.width = isActive ? '30px' : '10px';
                b.style.background = isActive ? '#6366f1' : '#cbd5e1';
              });
              
              const slideWidth = slides[0].offsetWidth + 30; // 30 is gap
              const offset = (viewport.offsetWidth - slides[0].offsetWidth) / 2;
              currentTranslate = -currentIndex * slideWidth + offset;
              prevTranslate = currentTranslate;
              track.style.transform = 'translateX(' + currentTranslate + 'px)';
            }

            // Initial position with a bit more delay to ensure layout is ready
            setTimeout(updateUI, 200);

            function goTo(index) {
              currentIndex = (index + slides.length) % slides.length;
              updateUI();
            }

            nextBtn.onclick = function() { goTo(currentIndex + 1); };
            prevBtn.onclick = function() { goTo(currentIndex - 1); };
            
            bullets.forEach(function(b, i) {
              b.onclick = function() { goTo(i); };
            });

            // Drag support
            viewport.onmousedown = dragStart;
            viewport.ontouchstart = dragStart;
            viewport.onmouseup = dragEnd;
            viewport.ontouchend = dragEnd;
            viewport.onmousemove = dragMove;
            viewport.ontouchmove = dragMove;
            viewport.onmouseleave = dragEnd;

            function dragStart(e) {
              isDragging = true;
              viewport.classList.add('grabbing');
              startPos = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
              track.style.transition = 'none';
            }

            function dragMove(e) {
              if (!isDragging) return;
              const currentPos = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
              const diff = currentPos - startPos;
              track.style.transform = 'translateX(' + (prevTranslate + diff) + 'px)';
            }

            function dragEnd(e) {
              if (!isDragging) return;
              isDragging = false;
              viewport.classList.remove('grabbing');
              track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              
              const move = (e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX) - startPos;
              if (move < -100) goTo(currentIndex + 1);
              else if (move > 100) goTo(currentIndex - 1);
              else updateUI();
            }

            // Auto-play
            let autoPlayInterval = setInterval(function() { goTo(currentIndex + 1); }, 5000);
            container.onmouseenter = function() { clearInterval(autoPlayInterval); };
            container.onmouseleave = function() {
              clearInterval(autoPlayInterval);
              autoPlayInterval = setInterval(function() { goTo(currentIndex + 1); }, 5000);
            };

            window.addEventListener('resize', updateUI);
          })();
        </script>
      </section>
    `
  })
}

export function getDefaultTemplate(t: (key: string) => string) {
  return `
    <section style="
      width: 100%;
      padding: 80px 40px;
      background: #ffffff;
      font-family: 'Inter', system-ui, sans-serif;
    ">
      <h2 style="
        text-align: center;
        font-size: 2.2rem; font-weight: 800;
        color: #1e1b4b; margin: 0 0 16px;
        letter-spacing: -0.02em;
      ">${t('editor.defaultTemplate.title')}</h2>
      <p style="
        text-align: center; color: #6b7280;
        font-size: 18px; margin: 0 0 64px;
        max-width: 600px; margin-left: auto; margin-right: auto;
        line-height: 1.6;
      ">${t('editor.defaultTemplate.subtitle')}</p>

      <div style="
        display: flex;
        gap: 32px;
        max-width: 1100px;
        margin: 0 auto;
        flex-wrap: wrap;
      ">
        <!-- Column 1 -->
        <div style="
          flex: 1; min-width: 300px;
          padding: 40px;
          background: #f8fbff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        ">
          <div style="
            width: 56px; height: 56px; border-radius: 14px;
            background: linear-gradient(135deg, #6c63ff, #a78bfa);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-bottom: 24px;
            box-shadow: 0 8px 16px rgba(108, 99, 255, 0.2);
          ">✨</div>
          <h3 style="
            font-size: 1.4rem; font-weight: 700;
            color: #1e1b4b; margin: 0 0 14px;
          ">${t('editor.defaultTemplate.feature1Title')}</h3>
          <p style="
            font-size: 16px; line-height: 1.7;
            color: #4b5563; margin: 0;
          ">${t('editor.defaultTemplate.feature1Text')}</p>
        </div>

        <!-- Column 2 -->
        <div style="
          flex: 1; min-width: 300px;
          padding: 40px;
          background: #f8fbff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        ">
          <div style="
            width: 56px; height: 56px; border-radius: 14px;
            background: linear-gradient(135deg, #34d399, #059669);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-bottom: 24px;
            box-shadow: 0 8px 16px rgba(52, 211, 153, 0.2);
          ">🚀</div>
          <h3 style="
            font-size: 1.4rem; font-weight: 700;
            color: #1e1b4b; margin: 0 0 14px;
          ">${t('editor.defaultTemplate.feature2Title')}</h3>
          <p style="
            font-size: 16px; line-height: 1.7;
            color: #4b5563; margin: 0;
          ">${t('editor.defaultTemplate.feature2Text')}</p>
        </div>
      </div>
    </section>
  `
}
