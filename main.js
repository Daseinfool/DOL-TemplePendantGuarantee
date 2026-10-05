// TemplePendantGuarantee
// 在脚本加载时立即修改 DOM 中的 tw-passagedata
// 同时在 :storyready 事件时再次尝试修改 Story 对象

(function() {
    function patchPassage() {
        // 方式1：直接修改 DOM 中的 tw-passagedata
        const storyData = document.querySelector('tw-storydata');
        if (storyData) {
            const passages = storyData.querySelectorAll('tw-passagedata');
            for (const passage of passages) {
                if (passage.getAttribute('name') === 'Temple Prayer') {
                    let text = passage.textContent;
                    const findStr = '<<rng>>\n<<if $rng is 100 or $rng gte 91 and $worn.neck.name is "holy pendant">>';
                    const replaceStr = '<<if $worn.neck.name is "holy pendant">><<set $rng to 100>><<elseif $worn.neck.name is "stone pendant">><<set $rng to 99>><<elseif $worn.neck.name is "dark pendant">><<set $rng to 98>><<else>><<rng>><</if>>\n<<if $rng is 100 or $rng gte 91 and $worn.neck.name is "holy pendant">>';

                    if (text.includes(findStr)) {
                        text = text.replace(findStr, replaceStr);
                        passage.textContent = text;
                        console.log('[TemplePendantGuarantee] DOM patched successfully');
                        return true;
                    }
                }
            }
        }

        // 方式2：修改 Story 对象
        if (typeof Story !== 'undefined' && Story.get) {
            try {
                const passage = Story.get('Temple Prayer');
                if (passage && passage.text) {
                    let text = passage.text;
                    const findStr = '<<rng>>\n<<if $rng is 100 or $rng gte 91 and $worn.neck.name is "holy pendant">>';
                    const replaceStr = '<<if $worn.neck.name is "holy pendant">><<set $rng to 100>><<elseif $worn.neck.name is "stone pendant">><<set $rng to 99>><<elseif $worn.neck.name is "dark pendant">><<set $rng to 98>><<else>><<rng>><</if>>\n<<if $rng is 100 or $rng gte 91 and $worn.neck.name is "holy pendant">>';

                    if (text.includes(findStr)) {
                        text = text.replace(findStr, replaceStr);
                        passage.text = text;
                        console.log('[TemplePendantGuarantee] Story patched successfully');
                        return true;
                    }
                }
            } catch (e) {
                console.log('[TemplePendantGuarantee] Story patch error:', e);
            }
        }

        return false;
    }

    // 立即尝试
    if (!patchPassage()) {
        console.log('[TemplePendantGuarantee] immediate patch failed, waiting for :storyready');
        // 等待 :storyready 事件
        if (typeof $ !== 'undefined') {
            $(document).one(':storyready', function() {
                setTimeout(function() {
                    if (!patchPassage()) {
                        console.log('[TemplePendantGuarantee] :storyready patch also failed');
                    }
                }, 100);
            });
        }
    }
})();
