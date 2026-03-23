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
      <section style="
        width: 100%; padding: clamp(40px, 8vw, 80px) 0;
        background: #f9fafb;
        font-family: 'Inter', system-ui, sans-serif;
        overflow: hidden;
      ">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 20px;">
          <h2 style="
            text-align: center;
            font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800;
            color: #111827; margin: 0 0 12px;
            letter-spacing: -0.02em;
          ">What Our Clients Say</h2>
          <p style="
            text-align: center; color: #6b7280;
            font-size: clamp(14px, 2vw, 17px); margin: 0 0 48px;
            max-width: 600px; margin-left: auto; margin-right: auto;
          ">Discover why thousands of users love building their presence with us.</p>
        </div>

        <!-- Carousel Viewport -->
        <div style="
          position: relative;
          width: 100%;
          overflow: hidden;
        ">
          <div style="
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            gap: 24px;
            padding: 20px 40px 40px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          ">
            <!-- Testimonial 1 -->
            <div style="
              flex: 0 0 clamp(280px, 80vw, 350px);
              scroll-snap-align: center;
              background: #ffffff;
              padding: 32px;
              border-radius: 20px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              border: 1px solid #f3f4f6;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            ">
              <div>
                <div style="color: #fbbf24; font-size: 20px; margin-bottom: 16px;">★★★★★</div>
                <p style="font-size: 16px; line-height: 1.6; color: #374151; font-style: italic; margin-bottom: 24px;">
                  "The editor is incredibly intuitive. I was able to build my professional landing page in less than an hour without writing a single line of code."
                </p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #e0e7ff; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #4338ca;">JS</div>
                <div>
                  <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">Sarah Jenkins</h4>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">Marketing Director</p>
                </div>
              </div>
            </div>

            <!-- Testimonial 2 -->
            <div style="
              flex: 0 0 clamp(280px, 80vw, 350px);
              scroll-snap-align: center;
              background: #ffffff;
              padding: 32px;
              border-radius: 20px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              border: 1px solid #f3f4f6;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            ">
              <div>
                <div style="color: #fbbf24; font-size: 20px; margin-bottom: 16px;">★★★★★</div>
                <p style="font-size: 16px; line-height: 1.6; color: #374151; font-style: italic; margin-bottom: 24px;">
                  "Outstanding performance and flexibility. The pre-built blocks are beautifully designed and easy to customize to match our brand."
                </p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #15803d;">MA</div>
                <div>
                  <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">Marcus Aurelio</h4>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">Startup Founder</p>
                </div>
              </div>
            </div>

            <!-- Testimonial 3 -->
            <div style="
              flex: 0 0 clamp(280px, 80vw, 350px);
              scroll-snap-align: center;
              background: #ffffff;
              padding: 32px;
              border-radius: 20px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              border: 1px solid #f3f4f6;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            ">
              <div>
                <div style="color: #fbbf24; font-size: 20px; margin-bottom: 16px;">★★★★★</div>
                <p style="font-size: 16px; line-height: 1.6; color: #374151; font-style: italic; margin-bottom: 24px;">
                  "The best GrapesJS integration I've seen. Nuxt 4 makes it feel snappy and modern. Highly recommended for any serious web project."
                </p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #b91c1c;">LW</div>
                <div>
                  <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">Laura White</h4>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">UX Designer</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Indicators -->
          <div style="display: flex; justify-content: center; gap: 8px; margin-top: -10px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #6366f1;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb;"></div>
          </div>
        </div>
        
        <style>
          /* Hide scrollbar for Chrome, Safari and Opera */
          .gjs-dashed *::-webkit-scrollbar {
            display: none;
          }
        </style>
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
