export default function MemberTypeRadioBtn() {
  return (
    <div className="flex flex-col gap-2">
      <p className="tj-body1">회원 유형</p>
      <div role="radiogroup" className="flex items-center gap-4">
        {/* 알바 옵션 */}
        <div>
          <label
            htmlFor="member"
            className="flex items-center gap-[9px] px-[41px] py-[13px] rounded-full bg-white border border-gray-30 cursor-pointer has-[:checked]:border-primary"
          >
            <input
              type="radio"
              id="member"
              name="member-type"
              value="MEMBER"
              className="peer hidden"
            />
            <span className="h-5 w-5 rounded-full border border-gray-30 bg-white peer-checked:border-primary peer-checked:bg-[url('/images/ModalAction.svg')] peer-checked:bg-center peer-checked:bg-no-repeat" />
            <span className="select-none">알바님</span>
          </label>
        </div>

        {/* 사장 옵션 */}
        <div>
          <label
            htmlFor="owner"
            className="flex items-center gap-[9px] px-[41px] py-[13px] rounded-full bg-white border border-gray-30 cursor-pointer has-[:checked]:border-primary"
          >
            <input
              type="radio"
              id="owner"
              name="member-type"
              value="OWNER"
              className="peer hidden"
            />
            <span className="h-5 w-5 rounded-full border border-gray-30 bg-white peer-checked:border-primary peer-checked:bg-[url('/images/ModalAction.svg')] peer-checked:bg-center peer-checked:bg-no-repeat" />
            <span className="select-none">사장님</span>
          </label>
        </div>
      </div>
    </div>
  );
}
