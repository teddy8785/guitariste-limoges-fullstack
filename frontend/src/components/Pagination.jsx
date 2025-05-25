function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="main__pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`main__pagination--button ${
            currentPage === index + 1 ? "active" : ""
          }`}
          onClick={() => onPageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
