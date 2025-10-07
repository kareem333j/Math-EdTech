import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './pdf.css';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export const PDF = (props) => {
    const rootPath = 'https://mostafahamdy.com/media/';
    const fullUrl = encodeURI(`${rootPath}${props.path}`);
    const isPdf = props.path?.toLowerCase().endsWith('.pdf');

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    if (!isPdf) {
        return (
            <div className='d-flex w-100 student-area-image justify-content-center align-items-center text-center'>
                <img
                    src={fullUrl}
                    alt='file'
                />
            </div>
        );
    }

    return (
        <div className='pdf-div pb-3'>
            <div className='options d-flex gap-2 justify-content-center align-items-center'>
                <span style={{ 'fontSize': '1.1em', 'color': 'var(--color-default2)' }}>اذا كنت تريد رؤية الملف بشكل افضل </span>
                <a className='btn btn-danger fw-bold' target="_blank" rel="noopener noreferrer" href={fullUrl}>اضغط هنا</a>
            </div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={fullUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
        </div>
    );
};

