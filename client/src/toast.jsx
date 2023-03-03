export function Toast() {
  return (
    <div class="wrapper">
      <div class="toast success">
        <div class="outer-container">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="inner-container">
          <p>Success</p>
          <p>Your changes saved successfully</p>
        </div>
        <button>&times;</button>
      </div>
      <div class="toast error">
        <div class="outer-container">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="inner-container">
          <p>Error</p>
          <p>Error has occured while saving changes.</p>
        </div>
        <button>&times;</button>
      </div>
      <div class="toast info">
        <div class="outer-container">
          <i class="fas fa-info-circle"></i>
        </div>
        <div class="inner-container">
          <p>Info</p>
          <p>New settings available on your account.</p>
        </div>
        <button>&times;</button>
      </div>
      <div class="toast warning">
        <div class="outer-container">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="inner-container">
          <p>Warning</p>
          <p>Username you have entered is invalid.</p>
        </div>
        <button>&times;</button>
      </div>
    </div>
  );
}
