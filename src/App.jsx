import Gallery from './Gallery'; // የፈጠርከውን Gallery ፋይል እዚህ ታመጣዋለህ

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        የእኔ አቪዬሽን ስብስብ
      </h1>
      
      {/* እዚህ ጋር ነው ጋለሪውን የምትጠራው */}
      <Gallery />
      
    </div>
  );
}

export default App;