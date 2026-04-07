export default function Support() {
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      
      <div className="support-header">
        <h1>Support Center</h1>
        <p style={{ opacity: 0.9 }}>We're here to help you 24/7</p>
      </div>

      <div className="card support-list">
        
        <div className="support-list-item">
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: '#e6f4ea', padding: '10px', borderRadius: '10px', fontSize: '20px' }}>💬</div>
            <div>
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Live Chat Support <span style={{ background: '#e6f4ea', color: '#2e7d32', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Online</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Chat with our support team or Umay AI</div>
            </div>
          </div>
          <div style={{ color: '#ccc' }}>&gt;</div>
        </div>

        <div className="support-list-item">
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: '#FDF2F5', padding: '10px', borderRadius: '10px', fontSize: '20px' }}>📞</div>
            <div>
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Emergency Hotline <span style={{ background: '#FDF2F5', color: '#F080A0', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Always Available</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>24/7 emergency support</div>
            </div>
          </div>
          <div style={{ color: '#ccc' }}>&gt;</div>
        </div>

        <div className="support-list-item">
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: '#eef2ff', padding: '10px', borderRadius: '10px', fontSize: '20px' }}>📄</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>FAQ & Help Center</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Find answers to common questions</div>
            </div>
          </div>
          <div style={{ color: '#ccc' }}>&gt;</div>
        </div>

      </div>

    </div>
  );
}