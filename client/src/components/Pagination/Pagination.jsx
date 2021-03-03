import React from 'react';
import './pagination.css'

const Pagination = ({ productPerPage, totalproduct, paginate, nextPage, prevPage,currentPage }) => {

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalproduct / productPerPage); i++) {
        pageNumbers.push(i);
    }

    return ( 
        
        <nav>
            <ul className="pagination justify-content-center">
                <li className={`${pageNumbers[0]=== currentPage && 'page-item disabled'}`}>
                    <a className="page-link" href="#" onClick={ () => prevPage()} >Pre</a>
                </li>
                {pageNumbers.map(num => (
                    <li className={`${currentPage===num && 'page-item active'}`} aria-current="page" key={num}>
                        <a onClick={() => paginate(num)} href="#" className="page-link">{num}</a>
                    </li>
                ))}
                <li className={`${pageNumbers.reverse()[0]=== currentPage && 'page-item disabled'}`}>
                    <a className="page-link" href="#" onClick={() => nextPage()}>Sig</a>
                </li>
            </ul>
        </nav>
     );
}
 
export default Pagination;