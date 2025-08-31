import html2pdf from 'html2pdf.js';

const opt = {
    margin: 1,
    filename: 'Demopdf.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
};

const printDocument = () => {
    const element = document.getElementById('flierDiv');
    if (element) {
        html2pdf().set(opt).from(element).save();
    } else {
        console.error("Element with id 'flierDiv' not found.");
    }
}

function SketchPage() {
  const outerBoxStyle: React.CSSProperties = {
    width: '600px',
    height: '400px',
    background: 'linear-gradient(to top right, #ed1515ff, #1a2cf1ff)', // Example linear gradient
    border: '2px solid black',
    padding: '20px',
    margin: '20px',
  };

  const innerBoxStyle: React.CSSProperties = {
    height: '320px',
    border: '2px solid blue',
    padding: '10px',
    margin: '10px',
    backgroundColor: '#d0e0ff',
  };

  return (
    <main>
      <div id='flierDiv' style={outerBoxStyle}>
        <div style={innerBoxStyle}>
            This is the text inside the inner box.
        </div>
      </div>
      <div>
        <button onClick={() => printDocument()}>Print</button>
      </div>
    </main>
  );
}

export default SketchPage;
