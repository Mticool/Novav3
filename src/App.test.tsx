// Minimal test version
export function AppTest() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#0a0a0a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }}>
      ✅ React работает!
      <br/>
      <span style={{ fontSize: '14px', marginTop: '20px' }}>
        Если видишь это - проблема не в React
      </span>
    </div>
  );
}

