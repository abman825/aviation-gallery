import { aviationPhotos } from './photo';

const Gallery = () => {
  return (
    <div>
      {/* ርዕሱን ከ map ውጭ አድርገው */}
      <h1 style={{ textAlign: 'center', margin: '100% 0', color: '#333' }}>
        የእኔ አቪዬሽን ስብስብ
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
        {aviationPhotos.map((photo) => (
          <div 
            key={photo.id} 
            style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={photo.image} alt={photo.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h2 style={{ padding: '10px', textAlign: 'center' }}>{photo.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;