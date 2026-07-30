import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Download,
  Printer,
  ReceiptText,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axiosInstance from "../../../config/AxiosInstance";

/* -------------------------------------------------------
   Money formatting
------------------------------------------------------- */

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* -------------------------------------------------------
   Amount to words
------------------------------------------------------- */

const numberToWords = (value) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertSmallNumber = (number) => {
    let words = "";

    if (number >= 100) {
      words += `${
        ones[Math.floor(number / 100)]
      } Hundred `;

      number %= 100;
    }

    if (number >= 20) {
      words += `${
        tens[Math.floor(number / 10)]
      } ${ones[number % 10]}`;
    } else {
      words += ones[number];
    }

    return words.trim();
  };

  let number = Math.floor(Number(value || 0));

  if (!number) {
    return "Zero Rupees Only";
  }

  const parts = [];

  const units = [
    [10000000, "Crore"],
    [100000, "Lakh"],
    [1000, "Thousand"],
  ];

  units.forEach(([unit, label]) => {
    if (number >= unit) {
      parts.push(
        `${convertSmallNumber(
          Math.floor(number / unit)
        )} ${label}`
      );

      number %= unit;
    }
  });

  if (number > 0) {
    parts.push(convertSmallNumber(number));
  }

  return `${parts.join(" ")} Rupees Only`;
};

/* -------------------------------------------------------
   Wait until invoice images load
------------------------------------------------------- */

const waitForImages = async (element) => {
  const images = Array.from(
    element.querySelectorAll("img")
  );

  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.onload = resolve;
          image.onerror = resolve;
        })
    )
  );
};

/* -------------------------------------------------------
   Invoice component
------------------------------------------------------- */

const Invoice = () => {
  const { orderId } = useParams();

  const invoiceRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isDownloading, setIsDownloading] =
    useState(false);

  /* -----------------------------------------------------
     Fetch order
  ----------------------------------------------------- */

  useEffect(() => {
    if (!orderId) {
      setPageError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setPageError("");

        const response = await axiosInstance.get(
          `/checkout/${orderId}`
        );

        if (!response.data?.order) {
          throw new Error("Order data was not found.");
        }

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "Error fetching invoice:",
          error.response?.data || error.message
        );

        setPageError(
          error.response?.data?.message ||
            "Unable to load invoice details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  /* -----------------------------------------------------
     Print invoice
  ----------------------------------------------------- */

  const printInvoice = () => {
    window.print();
  };

  /* -----------------------------------------------------
     Download invoice as one-page PDF
  ----------------------------------------------------- */

  const downloadInvoice = async () => {
    if (isDownloading) return;

    if (!order || !invoiceRef.current) {
      alert(
        "Invoice is not ready. Please try again."
      );
      return;
    }

    setIsDownloading(true);

    try {
      const invoiceElement = invoiceRef.current;

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(invoiceElement);

      await new Promise((resolve) => {
        window.setTimeout(resolve, 300);
      });

      const canvas = await html2canvas(
        invoiceElement,
        {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          width: invoiceElement.scrollWidth,
          height: invoiceElement.scrollHeight,
          windowWidth: 794,

          onclone: (clonedDocument) => {
            const clonedInvoice =
              clonedDocument.getElementById(
                "invoice-print"
              );

            if (!clonedInvoice) return;

            clonedInvoice.style.width = "794px";
            clonedInvoice.style.maxWidth = "794px";
            clonedInvoice.style.margin = "0";
            clonedInvoice.style.boxShadow = "none";
            clonedInvoice.style.transform = "none";
            clonedInvoice.style.backgroundColor =
              "#ffffff";
            clonedInvoice.style.color = "#111827";

            /*
             * Remove styles that may contain unsupported
             * modern colour functions.
             */
            const clonedElements = [
              clonedInvoice,
              ...clonedInvoice.querySelectorAll("*"),
            ];

            clonedElements.forEach((element) => {
              const computed =
                clonedDocument.defaultView.getComputedStyle(
                  element
                );

              const properties = [
                "color",
                "backgroundColor",
                "borderTopColor",
                "borderRightColor",
                "borderBottomColor",
                "borderLeftColor",
                "outlineColor",
                "textDecorationColor",
              ];

              properties.forEach((property) => {
                const value = computed[property];

                if (
                  typeof value === "string" &&
                  (value.includes("oklch") ||
                    value.includes("oklab") ||
                    value.includes("lab(") ||
                    value.includes("lch("))
                ) {
                  if (
                    property === "backgroundColor"
                  ) {
                    element.style[property] =
                      "transparent";
                  } else if (
                    property.includes("border") ||
                    property === "outlineColor"
                  ) {
                    element.style[property] =
                      "#111827";
                  } else {
                    element.style[property] =
                      "#111827";
                  }
                }
              });

              element.style.boxShadow = "none";
            });
          },
        }
      );

      const imageData = canvas.toDataURL(
        "image/jpeg",
        0.96
      );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 6;

      const availableWidth =
        pageWidth - margin * 2;

      const availableHeight =
        pageHeight - margin * 2;

      const widthScale =
        availableWidth / canvas.width;

      const heightScale =
        availableHeight / canvas.height;

      /*
       * This guarantees the complete invoice stays
       * inside one A4 page.
       */
      const scaleRatio = Math.min(
        widthScale,
        heightScale
      );

      const finalWidth =
        canvas.width * scaleRatio;

      const finalHeight =
        canvas.height * scaleRatio;

      const xPosition =
        (pageWidth - finalWidth) / 2;

      /*
       * Keep invoice close to the top instead of adding
       * large empty space above it.
       */
      const yPosition = margin;

      pdf.addImage(
        imageData,
        "JPEG",
        xPosition,
        yPosition,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      const invoiceFileNumber =
        order.serialNumber ||
        orderId ||
        Date.now();

      pdf.save(
        `invoice-${invoiceFileNumber}.pdf`
      );
    } catch (error) {
      console.error(
        "Error generating PDF:",
        error
      );

      alert(
        error?.message
          ? `Failed to download invoice: ${error.message}`
          : "Failed to download invoice PDF."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /* -----------------------------------------------------
     Loading and error states
  ----------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
        <div className="rounded-xl bg-white px-8 py-6 shadow-md">
          <p className="font-medium text-[#475569]">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (pageError || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
        <div className="max-w-md rounded-xl bg-white px-8 py-6 text-center shadow-md">
          <p className="font-semibold text-[#dc2626]">
            {pageError ||
              "Invoice could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------
     Create invoice item list
  ----------------------------------------------------- */

  const items = [];

  order.courses?.forEach((courseItem) => {
    const course = courseItem?.course;

    if (course) {
      items.push({
        type: "Course",
        name:
          course.title ||
          course.name ||
          "Course",
        price: Number(course.price || 0),
      });
    }
  });

  order.books?.forEach((bookItem) => {
    const book = bookItem?.book;

    if (book) {
      items.push({
        type: "Book",
        name:
          book.title ||
          book.name ||
          "Book",
        price: Number(book.price || 0),
      });
    }
  });

  order.testSeries?.forEach((testItem) => {
    const test = testItem?.test;

    if (test) {
      items.push({
        type: "Test Series",
        name:
          test.title ||
          test.name ||
          "Test Series",
        price: Number(test.price || 0),
      });
    }
  });

  order.combo?.forEach((comboItem) => {
    const combo = comboItem?.combo;

    if (combo) {
      items.push({
        type: "Combo",
        name:
          combo.title ||
          combo.name ||
          "Combo",
        price: Number(combo.price || 0),
      });
    }
  });

  const calculatedTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0),
    0
  );

  const total = Number(
    order.totalAmount ?? calculatedTotal
  );

  // Data-only: support the common coupon fields returned by different checkout response versions.
  const appliedCoupon =
    order.coupon ||
    order.appliedCoupon ||
    order.couponCode ||
    order.promoCode ||
    null;

  const couponCode =
    typeof appliedCoupon === "string"
      ? appliedCoupon
      : appliedCoupon?.code ||
        appliedCoupon?.couponCode ||
        "Applied Offer";

  const hasAppliedCoupon = Boolean(appliedCoupon);
  const couponDiscount = Math.max(
    Number(
      order.discountAmount ??
        order.couponDiscount ??
        order.couponDiscountAmount ??
        appliedCoupon?.discountAmount ??
        (calculatedTotal - total)
    ) || 0,
    0
  );

  const invoiceNo =
    order.serialNumber ||
    String(order._id || orderId)
      .slice(-8)
      .toUpperCase();

  const invoiceDate = new Date(
    order.createdAt || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const student = order.user || {};

  const fatherName =
    student.fatherName ||
    order.fatherName ||
    "—";

  const motherName =
    student.motherName ||
    order.motherName ||
    "—";

  const studentName =
    student.name ||
    order.studentName ||
    "Guest";

  const studentPhone =
    student.phone ||
    student.mobile ||
    order.phone ||
    "—";

  const studentEmail =
    student.email ||
    order.email ||
    "—";

  const studentAddress =
    student.address ||
    order.address ||
    "";

  /* -----------------------------------------------------
     Render invoice
  ----------------------------------------------------- */

  return (
    <div className="min-h-screen overflow-x-auto bg-[#f1f5f9] p-4 sm:p-6">
      {/* Action bar */}

      <div className="no-print mx-auto mb-5 flex w-[794px] max-w-none flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center text-xl font-bold sm:text-2xl">
            <ReceiptText className="mr-3 h-6 w-6" />
            Invoice
          </h1>

          <p className="mt-1 text-sm text-white">
            View, print or download the student
            invoice
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={printInvoice}
            className="flex items-center rounded-lg bg-[#204972] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#183654]"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>

          <button
            type="button"
            onClick={downloadInvoice}
            disabled={isDownloading}
            className={`flex items-center rounded-lg bg-[#204972] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#183654] ${
              isDownloading
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            <Download className="mr-2 h-4 w-4" />

            {isDownloading
              ? "Preparing..."
              : "Download"}
          </button>
        </div>
      </div>

      {/* Invoice sheet */}

      <main
        ref={invoiceRef}
        id="invoice-print"
        className="invoice-sheet mx-auto bg-white text-[#111827] shadow-xl"
      >
        {/* Invoice header */}

        <header className="invoice-header">
          <div className="company-section">
            <img
              src="/Images/pv-logo.png"
              alt="PV Classes"
              crossOrigin="anonymous"
              className="company-logo"
            />

            <div>
              <h2 className="company-name">
                PV Classes
              </h2>

              <p className="company-tagline">
                Education for Success
              </p>

              <div className="company-contact">
                <p>Pvclasses01@gmail.com</p>
                <p>0141-4511098</p>

                {/* <p>
                  <strong>GST No:</strong>{" "}
                  ______
                </p> */}
              </div>
            </div>
          </div>

          <div className="invoice-heading-section">
            <h3 className="invoice-title">
              Invoice
            </h3>

            <p>
              <strong>Invoice No:</strong>{" "}
              {invoiceNo}
            </p>

            <p>
              <strong>Invoice Date:</strong>{" "}
              {invoiceDate}
            </p>
          </div>
        </header>

        {/* Student and order information */}

        <section className="information-section">
          <div className="student-information">
            <p>
              <strong>
                Student&apos;s Name:
              </strong>{" "}
              {studentName}
            </p>

            <p>
              <strong>
                Father&apos;s Name:
              </strong>{" "}
              {fatherName}
            </p>

            <p>
              <strong>
                Mother&apos;s Name:
              </strong>{" "}
              {motherName}
            </p>

            <p>
              <strong>
                Mobile Number:
              </strong>{" "}
              {studentPhone}
            </p>

            <p className="breakable-text">
              <strong>
                Email Address:
              </strong>{" "}
              {studentEmail}
            </p>

            {studentAddress && (
              <p className="breakable-text">
                <strong>Address:</strong>{" "}
                {studentAddress}
              </p>
            )}
          </div>

          <div className="order-information">
            <p className="breakable-text">
              <strong>
                Order Number:
              </strong>{" "}
              {order._id}
            </p>

            <p>
              <strong>
                Order Status:
              </strong>{" "}
              <span className="capitalize">
                {order.orderStatus || "—"}
              </span>
            </p>

            <p>
              <strong>
                Payment Mode:
              </strong>{" "}
              <span className="capitalize">
                {order.paymentMethod || "—"}
              </span>
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}
              <span className="capitalize">
                {order.paymentStatus || "—"}
              </span>
            </p>
          </div>
        </section>

        {/* Items table */}

        <table className="invoice-table">
          <thead>
            <tr>
              <th className="serial-column">
                S.No.
              </th>

              <th className="type-column">
                Type
              </th>

              <th className="description-column">
                Item / Description
              </th>

              <th className="amount-column">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={`${item.type}-${item.name}-${index}`}
                >
                  <td className="text-center">
                    {index + 1}
                  </td>

                  <td>{item.type}</td>

                  <td className="item-name">
                    {item.name}
                  </td>

                  <td className="text-right">
                    {money(item.price)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center">
                  1
                </td>

                <td>Order</td>

                <td className="item-name">
                  Online purchase
                </td>

                <td className="text-right">
                  {money(total)}
                </td>
              </tr>
            )}

            {Array.from({ length: 5 }).map(
              (_, index) => (
                <tr
                  key={`empty-row-${index}`}
                  className="invoice-spacer-row"
                  aria-hidden="true"
                >
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              )
            )}

            {hasAppliedCoupon && (
              <>
                {/* UI-only: present coupon calculations as a compact invoice totals summary. */}
                <tr className="invoice-subtotal-row">
                  <td colSpan="3">Subtotal</td>
                  <td>{money(total + couponDiscount)}</td>
                </tr>
                <tr className="coupon-discount-row">
                  <td colSpan="3">
                    Less: Coupon Discount
                    <span className="coupon-code">
                      ({couponCode})
                    </span>
                  </td>
                  <td>-{money(couponDiscount)}</td>
                </tr>
              </>
            )}

            <tr className="grand-total-row">
              <td
                colSpan="3"
                className="grand-total-label"
              >
                Grand Total
              </td>

              <td className="grand-total-amount">
                {money(total)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount in words */}

        <div className="amount-in-words">
          <strong>
            Amount (in words):
          </strong>{" "}
          {numberToWords(total)}
        </div>

        {/* Footer */}

        <footer className="invoice-footer">
          <div>
            <p className="thank-you-text">
              Thank you for choosing PV Classes
              for your learning journey!
            </p>

            <p className="computer-generated-text">
              This is a computer-generated student
              invoice for your records.
            </p>
          </div>

          <div className="signature-section">
            <img
              src="/Images/DigitalSign.png"
              alt="PV Classes digital signature"
              className="digital-signature"
            />
            <div className="signature-line" />

            <p className="signature-title">
              Authorized Signatory
            </p>

            <p className="signature-company">
              For PV Classes
            </p>
          </div>
        </footer>
      </main>

      {/* Invoice styles */}

      <style>{`
        .invoice-sheet {
          width: 794px;
          max-width: 794px;
          padding: 28px 34px;
          box-sizing: border-box;
          background: #ffffff;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        .invoice-sheet,
        .invoice-sheet *,
        .invoice-sheet *::before,
        .invoice-sheet *::after {
          box-sizing: border-box;
        }

        .invoice-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          padding-bottom: 14px;
          border-bottom: 2px solid #111827;
        }

        .company-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .company-logo {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          object-fit: contain;
        }

        .company-name {
          margin: 0;
          color: #111827;
          font-size: 23px;
          font-weight: 800;
          line-height: 1.1;
        }

        .company-tagline {
          margin: 3px 0 0;
          color: #111827;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.3;
        }

        .company-contact {
          margin-top: 5px;
          color: #475569;
          font-size: 9px;
          line-height: 1.45;
        }

        .company-contact p {
          margin: 0;
        }

        .invoice-heading-section {
          flex-shrink: 0;
          color: #111827;
          text-align: right;
          font-size: 10px;
          line-height: 1.5;
        }

        .invoice-heading-section p {
          margin: 2px 0 0;
        }

        .invoice-title {
          margin: 0 0 7px;
          color: #111827;
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .information-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 12px;
          padding: 10px 0;
          border-top: 1px solid #111827;
          border-bottom: 1px solid #111827;
          color: #111827;
          font-size: 10px;
          line-height: 1.45;
        }

        .information-section p {
          margin: 0 0 4px;
        }

        .information-section p:last-child {
          margin-bottom: 0;
        }

        .order-information {
          padding-left: 24px;
          border-left: 1px solid #cbd5e1;
        }

        .breakable-text {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .invoice-table {
          width: 100%;
          margin-top: 12px;
          border-collapse: collapse;
          table-layout: fixed;
          color: #111827;
          font-size: 10px;
        }

        .invoice-table th,
        .invoice-table td {
          border: 1px solid #111827;
          padding: 7px 8px;
          vertical-align: middle;
          line-height: 1.3;
        }

        .invoice-table th {
          background: #e8edf2;
          color: #111827;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .invoice-table tbody tr:not(.grand-total-row) {
          height: 38px;
        }

        .invoice-table .invoice-spacer-row {
          height: 38px;
        }

        .invoice-table .invoice-spacer-row td {
          padding: 0;
          background: #ffffff;
        }

        .invoice-subtotal-row td,
        .coupon-discount-row td {
          padding-top: 7px;
          padding-bottom: 7px;
          background: #ffffff;
          color: #111827;
          font-size: 10px;
        }

        .invoice-subtotal-row td:first-child,
        .coupon-discount-row td:first-child {
          text-align: right;
          font-weight: 700;
        }

        .invoice-subtotal-row td:last-child,
        .coupon-discount-row td:last-child {
          text-align: right;
          white-space: nowrap;
          font-weight: 700;
        }

        .coupon-code {
          margin-left: 6px;
          color: #475569;
          font-weight: 600;
        }

        .serial-column {
          width: 8%;
          text-align: center;
        }

        .type-column {
          width: 18%;
          text-align: left;
        }

        .description-column {
          width: 54%;
          text-align: left;
        }

        .amount-column {
          width: 20%;
          text-align: right;
        }

        .item-name {
          font-weight: 600;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        .grand-total-row td {
          background: #e8edf2;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .grand-total-label {
          text-align: right;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .grand-total-amount {
          text-align: right;
          font-size: 11px;
          font-weight: 800;
        }

        .amount-in-words {
          padding: 8px;
          border-right: 1px solid #111827;
          border-bottom: 1px solid #111827;
          border-left: 1px solid #111827;
          color: #111827;
          font-size: 10px;
          line-height: 1.4;
        }

        .invoice-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          gap: 28px;
          margin-top: 24px;
          color: #111827;
        }

        .thank-you-text {
          margin: 0;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.35;
        }

        .computer-generated-text {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 9px;
          line-height: 1.35;
        }

        .signature-section {
          text-align: right;
        }

        .digital-signature {
          display: block;
          width: 210px;
          height: auto;
          margin: 0 0 4px auto;
          object-fit: contain;
        }

        .signature-line {
          width: 210px;
          height: 0;
          margin: 0 0 5px auto;
          border-bottom: 1px solid #111827;
        }

        .signature-title {
          margin: 0;
          font-size: 10px;
          font-weight: 700;
        }

        .signature-company {
          margin: 2px 0 0;
          font-size: 9px;
        }

        @media screen and (max-width: 850px) {
          .invoice-sheet {
            width: 794px;
            max-width: 794px;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          body * {
            visibility: hidden;
          }

          #invoice-print,
          #invoice-print * {
            visibility: visible;
          }

          #invoice-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm;
            max-width: 210mm;
            margin: 0;
            padding: 10mm;
            box-shadow: none;
            background: #ffffff;
          }

          .no-print {
            display: none !important;
          }

          .invoice-table th,
          .invoice-table .grand-total-row td {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
