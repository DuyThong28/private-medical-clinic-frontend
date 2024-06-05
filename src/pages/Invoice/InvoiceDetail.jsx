import PreScriptionTab from "../../pages/settings/examination/PrescriptionTab";
import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertDate, localFormat, stringToDayFormat } from "../../util/date";
import {
  fetchAppointmentRecordByBill,
  fetchAppointmentRecordById,
} from "../../services/appointmentRecords";
import { formatToVND } from "../../util/money";

import MainInput from "../../components/MainInput";
import MainTextarea from "../../components/MainTextarea";
import MainSelect from "../../components/MainSelect";
import MainModal from "../../components/MainModal";
import Form from "react-bootstrap/Form";
import { fetchAllDisease } from "../../services/diseases";
import { fetchFeeConsult } from "../../services/argument";
import { createBill, fetchBillById } from "../../services/bill";

import NotificationDialog, {
  DialogAction,
} from "../../components/NotificationDialog";
import useAuth from "../../hooks/useAuth";
import { queryClient } from "../../main";
import logo from "../../assets/logo.png";
import { useReactToPrint } from "react-to-print";

const InvoiceDetail = forwardRef(function InvoiceDetail({ children }, ref) {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const modalRef = useRef();
  const notiDialogRef = useRef();
  modalRef.current?.isLarge();
  const [dialogState, setDialogState] = useState({
    feeconsult: 0,
    drugExpense: 0,
    isEditable: false,
  });
  const [appointmentRecordData, setAppointmentRecordData] = useState(null);

  const [isBill, setIsBill] = useState(false);
  const [titleSTate, setTitleState] = useState("Phiếu Khám Bệnh");
  const contentToPrint = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: titleSTate,

    onBeforePrint: () => {
      console.log("before printing...");
    },
    onAfterPrint: () => {
      console.log("after printing...");
    },
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (appointmentRecordData != null) {
      setTitleState(
        () =>
          `Phiếu Khám Bệnh-${appointmentRecordData.id}-${
            appointmentRecordData.patient.fullName
          }-${localFormat(appointmentRecordData.appointmentList.scheduleDate)}`
      );
    } else {
      setTitleState(() => "Phiếu Khám Bệnh");
    }
  }, [appointmentRecordData]);

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const feeConsultQuery = useQuery({
    queryKey: ["feeconsult"],
    queryFn: async () => {
      const res = (await fetchFeeConsult()) ?? 0;
      setDialogState((prevState) => {
        return {
          ...prevState,
          feeconsult: res,
        };
      });
      return res;
    },
  });

  const billMutate = useMutation({
    mutationFn: createBill,
    onSuccess: (data) => {
      modalRef.current.close();
      queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
      notiDialogRef.current.toastSuccess({ message: data.message });
      setDialogState((prevState) => {
        return {
          ...prevState,
          drugExpense: 0,
        };
      });
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function calculateDrugExpense({ totalPrice }) {
    if (!isBill) {
      setDialogState((prevState) => {
        const newDrugExpense = prevState.drugExpense + totalPrice;
        return { ...prevState, drugExpense: newDrugExpense };
      });
    } else {
      setDialogState((prevState) => {
        return { ...prevState };
      });
    }
  }

  const diseaseState = diseasesQuery.data;

  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => {
      return disease.id == id;
    })[0];
    return res?.diseaseName || "";
  }

  useImperativeHandle(ref, () => {
    return {
      async show({ id }) {
        setDialogState((prevState) => {
          return {
            ...prevState,
            drugExpense: 0,
          };
        });
        const resData = await fetchAppointmentRecordById({ id });
        setAppointmentRecordData(() => {
          return { ...resData };
        });
        setIsBill(false);
        modalRef.current.show({
          isEditable: true,
          header: "Thanh toán",
          action: "add",
        });
      },

      async showDetail({ bill }) {
        setDialogState((prevState) => {
          return {
            ...prevState,
            drugExpense: 0,
          };
        });

        const resData = await fetchAppointmentRecordByBill({ bill });
        const billData = await fetchBillById({ id: bill.id });
        if (resData && resData[0]) {
          setAppointmentRecordData(() => {
            return { ...resData[0] };
          });

          setDialogState({
            feeconsult: billData.feeConsult,
            drugExpense: billData.drugExpense,
            isEditable: false,
          });

          setIsBill(true);
          modalRef.current.show({
            isEditable: false,
            header: "Hóa đơn",
            action: "view",
          });
        }
      },
    };
  });

  function submitHandler() {
    function submit() {
      billMutate.mutate({
        patientId: appointmentRecordData?.patientId,
        appointmentListId: appointmentRecordData?.appointmentListId,
        drugExpense: dialogState?.drugExpense,
        feeConsult: dialogState?.feeconsult,
      });
    }

    notiDialogRef.current.setDialogData({
      action: DialogAction.FINISH,
      dispatchFn: submit,
    });

    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận thanh toán?",
    });
  }

  const formBody = (
    <div>
      <div className="row  gap-3">
        <div className="col">
          <div className="row gap-3">
            <MainInput
              name={"patientid"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patientId
              }
              label={"Mã bệnh nhân"}
            />
            <MainInput
              name={"fullname"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.fullName
              }
              label={"Tên bệnh nhân"}
            />

            <MainInput
              name={"phonenumber"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData &&
                appointmentRecordData.patient.phoneNumber
              }
              label={"Số điện thoại"}
            />
            <MainInput
              name={"gender"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.gender
              }
              label={"Giới tính"}
            />
            <MainInput
              name={"birthyear"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.birthYear
              }
              label={"Năm sinh"}
            />
            <MainInput
              name={"address"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.address
              }
              label={"Địa chỉ"}
            />
          </div>
          <div className="row gap-3 w-100">
            <div className="col w-100">
              <div className="row">
                <MainInput
                  name={"appointmentid"}
                  isEditable={dialogState.isEditable}
                  defaultValue={
                    appointmentRecordData && appointmentRecordData.id
                  }
                  label={"Mã ca khám"}
                />
                <MainInput
                  name="scheduledate"
                  defaultValue={
                    appointmentRecordData &&
                    convertDate(
                      appointmentRecordData.appointmentList.scheduleDate
                    )
                  }
                  isEditable={dialogState.isEditable}
                  label={"Ngày khám"}
                  type={"date"}
                />
                <MainTextarea
                  name="symptoms"
                  defaultValue={
                    appointmentRecordData && appointmentRecordData.symptoms
                  }
                  isEditable={dialogState.isEditable}
                  label={"Triệu chứng"}
                />
              </div>
            </div>
            <div className="col w-100">
              <MainSelect
                name={"diagnostic"}
                defaultValue={
                  appointmentRecordData && appointmentRecordData.diseaseId
                }
                isEditable={dialogState.isEditable}
                label={"Chuẩn đoán"}
                options={
                  diseaseState &&
                  diseaseState.map((disease) => {
                    return (
                      <option key={disease.id} value={disease.id}>
                        {disease.diseaseName}
                      </option>
                    );
                  })
                }
                text={
                  appointmentRecordData &&
                  getDiseaseName({
                    id: appointmentRecordData.diseaseId,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row  overflow-hidden h-100">
        <PreScriptionTab
          recordId={appointmentRecordData?.id}
          isEditable={dialogState.isEditable}
          setExpense={calculateDrugExpense}
          isBill={true}
        />
      </div>
      <div className="d-flex mt-3 justify-content-end text-dark">
        <div style={{ width: "20rem" }}>
          <div className="row justify-content-around">
            <span className="col">Tổng tiền thuốc:</span>
            <span className="col text-end">
              {formatToVND(dialogState.drugExpense)}
            </span>
          </div>
          <div className="row justify-content-around">
            <span className="col">Tiền khám:</span>
            <span className="col text-end">
              {formatToVND(dialogState.feeconsult)}
            </span>
          </div>
          <div className="row justify-content-around">
            <span className="col">Bệnh nhân phải trả: </span>
            <span className="col text-end">
              {formatToVND(dialogState.drugExpense + dialogState.feeconsult)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const printContent = (
    <div
      ref={contentToPrint}
      style={{
        padding: "1.5rem",
        background: "white",
        height: "100%",
      }}
    >
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <div className="d-flex flex-row">
          <img src={logo} style={{ width: "4rem", height: "4rem" }} />
          <div
            style={{
              fontSize: "0.9rem",
              paddingLeft: "0.5rem",
              fontWeight: "600",
              color: "#555555",
            }}
          >
            <p style={{ padding: 0, margin: 0 }}>Private Medical Clinic</p>
            <p style={{ padding: 0, margin: 0 }}>Địa chỉ: Tp.HCM</p>
            <p style={{ padding: 0, margin: 0 }}>SDT: 0343855777</p>
          </div>
        </div>
        <div className="fw-bold mt-3 fs-4 text-black text-center">
          <label>PHIẾU KHÁM BỆNH</label>
        </div>
      </div>
      {formBody}
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <div className="text-end text-dark" style={{ fontStyle: "italic" }}>
          {stringToDayFormat()}
        </div>
        <div className="d-flex flex-row justify-content-around text-center mt-2">
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#000000",
              }}
            >
              BÁC SĨ KHÁM
            </label>
            <p style={{ fontStyle: "italic" }}>{"(Ký và ghi rõ họ tên)"}</p>
          </div>
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#000000",
              }}
            >
              NGƯỜI NỘP TIỀN
            </label>
            <p style={{ fontStyle: "italic" }}>{"(Ký và ghi rõ họ tên)"}</p>
          </div>
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#000000",
              }}
            >
              NGƯỜI THU TIỀN
            </label>
            <p style={{ fontStyle: "italic" }}>{"(Ký và ghi rõ họ tên)"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
        {printContent}
      </div>
      <NotificationDialog ref={notiDialogRef} keyQuery={["appointmentList"]} />
      <MainModal ref={modalRef}>
        <div tabIndex="-1" className="h-100">
          <div className="modal-body h-100">
            <Form className="w-100 h-100  gap-3">
              {formBody}
              {!isBill && permission?.includes("CInvoice") && (
                <div className="d-flex gap-3 mt-3 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary fw-bold"
                    onClick={handlePrint}
                  >
                    In biên lai
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary fw-bold"
                    onClick={submitHandler}
                  >
                    Thanh toán
                  </button>
                </div>
              )}
            </Form>
          </div>
        </div>
      </MainModal>
    </>
  );
});

export default InvoiceDetail;
