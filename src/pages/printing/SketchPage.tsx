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

  return (
    <main>
      <div className='sketchOuterBox' id='flierDiv'>
        <div className='sketchInnerBox'>
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
