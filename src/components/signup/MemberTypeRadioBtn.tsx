export default function MemberTypeRadioBtn() {
  return (
    <div className="flex flex-col gap-2">
      <p className="tj-body1">회원 유형</p>
      <div className="flex items-center gap-4">
        <div>
          <input
            type="radio"
            id="member"
            name="member-type"
            value="MEMBER"
            className="peer hidden"
          />
          <label
            htmlFor="member"
            className="flex items-center gap-[9px] px-[41px] py-[13px] rounded-full bg-white border border-gray-30 peer-checked:border-primary cursor-pointer"
          >
            <span className="h-5 w-5 rounded-full border border-gray-30 peer-checked:bg-primary"></span>
            <span className="select-none">알바님</span>
          </label>
        </div>
        <div>
          <input type="radio" id="owner" name="member-type" value="OWNER" className="peer hidden" />
          <label
            htmlFor="owner"
            className="flex items-center gap-[9px] px-[41px] py-[13px] rounded-full bg-white border border-gray-30 peer-checked:border-primary cursor-pointer"
          >
            <span className="h-5 w-5 rounded-full border border-gray-30 peer-checked:bg-primay"></span>
            <span className="select-none">사장님</span>
          </label>
        </div>
      </div>
    </div>
  );
}
